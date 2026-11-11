"""Prépare les fleurs qui s'ouvrent, dans la section des saisons : une séquence d'images par fleur, que le
défilement fait avancer comme celle du hero.

Installation, une fois :  pip install pillow numpy opencv-python-headless
                          et Real-ESRGAN (realesrgan-ncnn-vulkan, modèle realesr-animevideov3) sur le disque
Lancement :               python scripts/prepare_eclosions.py --esrgan chemin/realesrgan-ncnn-vulkan.exe
Sans --esrgan, agrandissement classique (moins net), pour dépanner.

Pour chaque vidéo source/eclosion-<fleur>.mp4 présente :
1. On mesure le mouvement d'une image à l'autre. Les images isolées qui sautent (un raté de la vidéo) sont écartées.
2. On coupe le début et la fin immobiles : on garde le passage du bouton fermé à la fleur ouverte.
3. On choisit COUNT images réparties selon la progression de l'ouverture, et non selon le temps : la fleur s'ouvre
   d'un pas régulier, sans à-coup, quelle que soit la vitesse de la vidéo d'origine.
4. Un carré centré sur la fleur, assez large pour la fleur ouverte (le fond uni est prolongé en haut et en bas).
5. Real-ESRGAN (modèle « vidéo », léger) l'agrandit deux fois ; on garde son détail, lissé d'une image à l'autre
   par flux optique pour qu'il ne scintille pas, puis une légère accentuation. Export en SIZE px, en WebP, dans
   public/eclosion/<fleur>/0001.webp…

6. Le mur uni derrière la fleur est teinté vers la couleur de fond de sa saison (la fleur n'est pas touchée) : sur
   le site, la vidéo s'estompe vers ses bords et se fond dans la page sans bord ni halo.

Le script écrit src/data/eclosions.json : pour chaque fleur, le nombre d'images, la couleur de saison et celle du
mur d'origine. Une fleur absente de cette
liste garde, sur le site, un repli : un zoom lent sur un détail de la photo de saison.
Une planche de contrôle est écrite dans source/_controle/eclosion-<fleur>.jpg.
"""
import argparse
import json
import shutil
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "source"
WORK = ROOT / "source" / "_travail" / "eclosion"
OUT = ROOT / "public" / "eclosion"
CONTROL = ROOT / "source" / "_controle"
MANIFEST = ROOT / "src" / "data" / "eclosions.json"
FLEURS = ["tulipe", "pivoine", "dahlia", "amaryllis"]
# La couleur de fond de la saison de chaque fleur (src/data/saisons.ts) : le mur de la vidéo est teinté vers elle,
# pour que la fleur se fonde dans la page sans bord ni halo.
SAISON = {"tulipe": "#eaf0e2", "pivoine": "#f6e5de", "dahlia": "#f2e4d3", "amaryllis": "#e5e9e6"}
KEY_NEAR = 14  # jusqu'à cette distance (en niveaux RVB) de la couleur du mur, le pixel est du mur…
KEY_FAR = 46  # … au-delà de celle-ci, c'est la fleur : on n'y touche pas. Entre les deux, une transition douce.

COUNT = 60  # une image tous les 20 px environ pendant que le panneau de la saison arrive
SIZE = 1080  # le carré exporté : la fleur s'affiche sur 60 à 70 % de la hauteur de l'écran
WIDEN = 1.3  # la largeur gardée, en part de la hauteur de la vidéo
QUALITY = 74
TRIM_START = 0.015  # on coupe tant que moins de 1,5 % du mouvement total a eu lieu…
TRIM_END = 0.975  # … et dès que 97,5 % ont eu lieu : la fleur est ouverte, plus rien ne bouge
# Une fin plus tôt pour une vidéo dont les dernières images ont un défaut (le dahlia : des coulures sous la fleur).
TRIM_END_PAR_FLEUR = {"dahlia": 0.93}
OUTLIER = 2.5  # une image qui s'écarte 2,5 fois plus de ses voisines qu'elles ne s'écartent entre elles est un raté

DETAIL = 0.85  # la part du détail de Real-ESRGAN gardée
DETAIL_MEMORY = 0.4  # la part reprise de l'image précédente : contre le scintillement
SHARPEN = 0.18

dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)


def read(path: Path) -> list[np.ndarray]:
    capture = cv2.VideoCapture(str(path))
    frames = []
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        frames.append(frame)
    capture.release()
    return frames


def small(frame: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(cv2.resize(frame, (320, 180), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)


def difference(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.abs(a - b).mean())


def drop_outliers(frames: list[np.ndarray]) -> list[np.ndarray]:
    grays = [small(frame) for frame in frames]
    keep = [0]
    for index in range(1, len(frames) - 1):
        through = difference(grays[index - 1], grays[index]) + difference(grays[index], grays[index + 1])
        around = difference(grays[index - 1], grays[index + 1])
        if through <= OUTLIER * around + 0.5:
            keep.append(index)
    keep.append(len(frames) - 1)
    return [frames[index] for index in keep]


def pick_by_progress(frames: list[np.ndarray], trim_end: float) -> list[np.ndarray]:
    grays = [small(frame) for frame in frames]
    steps = np.array([0.0] + [difference(grays[i - 1], grays[i]) for i in range(1, len(grays))])
    progress = np.cumsum(steps) / max(steps.sum(), 1e-6)
    start = int(np.searchsorted(progress, TRIM_START))
    end = int(np.searchsorted(progress, trim_end))
    # Des cibles régulièrement espacées dans la progression : chaque image avance la fleur d'autant que la précédente.
    targets = np.linspace(progress[start], progress[end], COUNT)
    indices = [int(np.argmin(np.abs(progress - target))) for target in targets]
    return [frames[index] for index in indices]


def square(frame: np.ndarray) -> np.ndarray:
    """Un carré centré sur la fleur, un peu plus large que la hauteur de la vidéo : la fleur ouverte y tient en
    entier. Le fond uni est prolongé en haut et en bas pour compléter le carré, sans que cela se voie."""
    height, width = frame.shape[:2]
    side = min(width, round(height * WIDEN))
    left = (width - side) // 2
    crop = frame[:, left : left + side]
    pad = (side - height) // 2
    if pad > 0:
        crop = cv2.copyMakeBorder(crop, pad, side - height - pad, 0, 0, cv2.BORDER_REPLICATE)
    return crop


def upscale(name: str, crops: list[np.ndarray], esrgan: Path | None, reuse: bool) -> list[np.ndarray] | None:
    if esrgan is None:
        return None
    raw, big = WORK / name / "brut", WORK / name / "agrandi"
    # --reuse : les images déjà agrandies par un passage précédent servent telles quelles (mêmes vidéos, mêmes réglages).
    if reuse and len(list(big.glob("*.png"))) == len(crops):
        return [cv2.imread(str(big / f"{number:04d}.png")) for number in range(1, len(crops) + 1)]
    for folder in (raw, big):
        shutil.rmtree(folder, ignore_errors=True)
        folder.mkdir(parents=True)
    for number, crop in enumerate(crops, start=1):
        cv2.imwrite(str(raw / f"{number:04d}.png"), crop)
    subprocess.run(
        # Tuiles de 128 px : avec de plus grandes, une carte graphique intégrée manque de mémoire et rend du noir.
        [str(esrgan), "-i", str(raw), "-o", str(big), "-n", "realesr-animevideov3", "-s", "2", "-t", "128", "-f", "png"],
        check=True,
        capture_output=True,
        cwd=esrgan.parent,
    )
    large = [cv2.imread(str(big / f"{number:04d}.png")) for number in range(1, len(crops) + 1)]
    if min(float(image.mean()) for image in large) < 5:
        raise SystemExit("Real-ESRGAN a rendu des images noires : réduire la taille des tuiles (-t).")
    return large


def combine(crops: list[np.ndarray], large: list[np.ndarray] | None) -> list[np.ndarray]:
    size = (SIZE, SIZE)
    y, x = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    previous_detail = previous_gray = None
    result = []
    for index, crop in enumerate(crops):
        base = cv2.resize(crop, size, interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        out = base
        if large is not None:
            detail = cv2.resize(large[index], size, interpolation=cv2.INTER_AREA).astype(np.float32) - base
            gray = cv2.cvtColor(np.clip(base, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
            if previous_detail is not None:
                flow = dis.calc(gray, previous_gray, None)
                carried = cv2.remap(previous_detail, x + flow[..., 0], y + flow[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
                detail = (1 - DETAIL_MEMORY) * detail + DETAIL_MEMORY * carried
            previous_detail, previous_gray = detail, gray
            out = base + DETAIL * detail
        blurred = cv2.GaussianBlur(out, (0, 0), 1.2)
        result.append(np.clip(out + SHARPEN * (out - blurred), 0, 255).astype(np.uint8))
    return result


def wall_bgr(frame: np.ndarray) -> np.ndarray:
    """La couleur du mur derrière la fleur : la médiane des bords de l'image, là où il n'y a que le fond."""
    band = max(frame.shape[0] // 12, 1)
    edges = np.concatenate([frame[:band].reshape(-1, 3), frame[:, :band].reshape(-1, 3), frame[:, -band:].reshape(-1, 3)])
    return np.median(edges, axis=0).astype(np.float32)


def to_hex(bgr: np.ndarray) -> str:
    b, g, r = np.clip(bgr, 0, 255).astype(int)
    return f"#{r:02x}{g:02x}{b:02x}"


def retint(frames: list[np.ndarray], wall: np.ndarray, target_hex: str) -> list[np.ndarray]:
    """Amène le mur à la couleur exacte de la saison. Chaque pixel prend cette couleur d'autant qu'il ressemble au
    mur : le fond entier la prend tout à fait (même là où la vidéo est un peu plus claire ou plus sombre), les ombres
    douces du fond en partie, la fleur et sa tige pas du tout."""
    r, g, b = (int(target_hex[i : i + 2], 16) for i in (1, 3, 5))
    target = np.array([b, g, r], dtype=np.float32)
    result = []
    for frame in frames:
        pixels = frame.astype(np.float32)
        distance = np.linalg.norm(pixels - wall, axis=2)
        weight = np.clip((KEY_FAR - distance) / (KEY_FAR - KEY_NEAR), 0, 1)[..., None]
        result.append(np.clip(pixels * (1 - weight) + target * weight, 0, 255).astype(np.uint8))
    return result


def control_sheet(name: str, frames: list[np.ndarray]) -> None:
    CONTROL.mkdir(parents=True, exist_ok=True)
    picks = [frames[round(i * (len(frames) - 1) / 7)] for i in range(8)]
    sheet = Image.new("RGB", (8 * 180, 180), "white")
    for index, frame in enumerate(picks):
        sheet.paste(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).resize((180, 180)), (index * 180, 0))
    sheet.save(CONTROL / f"eclosion-{name}.jpg", quality=88)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--esrgan", type=Path, help="chemin de realesrgan-ncnn-vulkan.exe")
    parser.add_argument("--reuse", action="store_true", help="reprendre les images déjà agrandies par Real-ESRGAN")
    args = parser.parse_args()

    manifest = {}
    for name in FLEURS:
        path = SOURCE / f"eclosion-{name}.mp4"
        target = OUT / name
        if not path.exists():
            shutil.rmtree(target, ignore_errors=True)
            print(f"{name} : pas de vidéo, le site garde le zoom sur la photo de saison")
            continue
        frames = read(path)
        cleaned = drop_outliers(frames)
        crops = [square(frame) for frame in pick_by_progress(cleaned, TRIM_END_PAR_FLEUR.get(name, TRIM_END))]
        combined = combine(crops, upscale(name, crops, args.esrgan, args.reuse))
        wall = wall_bgr(combined[0])
        final = retint(combined, wall, SAISON[name])
        shutil.rmtree(target, ignore_errors=True)
        target.mkdir(parents=True)
        total = 0
        for number, frame in enumerate(final, start=1):
            out = target / f"{number:04d}.webp"
            Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).save(out, "WEBP", quality=QUALITY, method=6)
            total += out.stat().st_size
        control_sheet(name, final)
        manifest[name] = {"count": len(final), "fond": SAISON[name], "mur": to_hex(wall)}
        removed = len(frames) - len(cleaned)
        print(f"{name} : {len(frames)} images lues, {removed} ratées écartées, {len(final)} gardées, {total // 1024} Ko, mur {manifest[name]['mur']} -> {SAISON[name]}")
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
