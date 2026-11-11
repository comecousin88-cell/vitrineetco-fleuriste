"""Découpe la vidéo du hero en séquence d'images que le scroll fait avancer, agrandie par Real-ESRGAN.

Installation, une fois :  pip install pillow numpy opencv-python-headless
                          et Real-ESRGAN (realesrgan-ncnn-vulkan, modèle realesrgan-x4plus) quelque part sur le disque
Lancement :               python scripts/prepare_hero.py --esrgan chemin/realesrgan-ncnn-vulkan.exe
Sans --esrgan, les images restent à la taille de la vidéo (agrandissement classique), pour dépanner.

1. Lit source/hero-composition.mp4 puis source/hero-ruban.mp4 à la suite (les tiges, puis le nœud du ruban) et
   garde COUNT images réparties régulièrement.
2. Real-ESRGAN les agrandit 4 fois. On n'en garde que le détail (ce qu'il ajoute à un agrandissement classique),
   ramené en 1920 px de large.
3. Ce détail est lissé d'une image à l'autre : on en reprend une part sur l'image précédente, recalée par flux
   optique. Sans cela, les pétales et le lin « grésilleraient » pendant le défilement.
4. Légère accentuation, puis trois séries dans public/hero/ :
   - hd/ : 1920 px de large, pour les grands écrans ;
   - landscape/ : 1280 px, pour les écrans plus petits ;
   - portrait/ : une bande verticale 3:4 centrée sur le bouquet, pour les téléphones. Elle est plus large que
     l'écran d'un téléphone : le site la recadre selon sa forme, bouquet au centre.
L'affiche (public/hero/fin.webp) vient de source/hero-fin.jpg, préparée par prepare_images.py.
Une image avant/après est écrite dans source/_controle/hero-avant-apres.jpg.
Si COUNT change, le reporter dans HERO_FRAMES (src/data/media.ts).
"""
import argparse
import shutil
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [ROOT / "source" / "hero-composition.mp4", ROOT / "source" / "hero-ruban.mp4"]
WORK = ROOT / "source" / "_travail" / "hero"
CONTROL = ROOT / "source" / "_controle"
OUT = ROOT / "public" / "hero"
COUNT = 96  # les deux vidéos (20 s) sur environ 1 400 px de défilement : une image tous les 15 px
BOUQUET_X = 0.5  # le centre du bouquet, du début à la fin, en part de la largeur de l'image

SIZE = (1920, 1080)
DETAIL = 0.85  # la part du détail de Real-ESRGAN gardée : assez pour la netteté, sans effet « peint »
DETAIL_MEMORY = 0.45  # la part du détail reprise de l'image précédente : c'est ce qui évite le scintillement
SHARPEN = 0.22  # la légère accentuation finale

FORMATS = {
    "hd": {"size": SIZE, "quality": 80},
    "landscape": {"size": (1280, 720), "quality": 80},
    "portrait": {"size": (810, 1080), "quality": 78},
}

dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)


def read_frames() -> list[np.ndarray]:
    frames = []
    for path in SOURCES:
        if not path.exists():
            continue
        capture = cv2.VideoCapture(str(path))
        while True:
            ok, frame = capture.read()
            if not ok:
                break
            frames.append(frame)
        capture.release()
        print(f"{path.name} : lue")
    if not frames:
        raise SystemExit("Aucune vidéo trouvée dans source/.")
    picks = [round(i * (len(frames) - 1) / (COUNT - 1)) for i in range(COUNT)]
    print(f"{len(frames)} images lues, {COUNT} gardées ({frames[0].shape[1]}x{frames[0].shape[0]})")
    return [frames[index] for index in picks]


def upscale(frames: list[np.ndarray], esrgan: Path | None) -> list[np.ndarray] | None:
    if esrgan is None:
        return None
    raw, big = WORK / "brut", WORK / "agrandi"
    for folder in (raw, big):
        shutil.rmtree(folder, ignore_errors=True)
        folder.mkdir(parents=True)
    for number, frame in enumerate(frames, start=1):
        cv2.imwrite(str(raw / f"{number:04d}.png"), frame)
    print("Real-ESRGAN : agrandissement en cours…")
    subprocess.run(
        # Tuiles de 128 px : avec de plus grandes, une carte graphique intégrée manque de mémoire et rend du noir.
        [str(esrgan), "-i", str(raw), "-o", str(big), "-n", "realesrgan-x4plus", "-s", "4", "-t", "128", "-f", "png"],
        check=True,
        capture_output=True,
        cwd=esrgan.parent,
    )
    large = [cv2.imread(str(big / f"{number:04d}.png")) for number in range(1, len(frames) + 1)]
    if min(float(image.mean()) for image in large) < 5:
        raise SystemExit("Real-ESRGAN a rendu des images noires : réduire la taille des tuiles (-t).")
    return large


def combine(frames: list[np.ndarray], large: list[np.ndarray] | None) -> list[np.ndarray]:
    """L'image agrandie classiquement, plus le détail de Real-ESRGAN lissé dans le temps, plus une légère netteté."""
    height, width = SIZE[1], SIZE[0]
    y, x = np.mgrid[0:height, 0:width].astype(np.float32)
    previous_detail = previous_gray = None
    raw_flicker, kept_flicker = [], []
    result = []
    for index, frame in enumerate(frames):
        base = cv2.resize(frame, SIZE, interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        out = base
        if large is not None:
            detail = cv2.resize(large[index], SIZE, interpolation=cv2.INTER_AREA).astype(np.float32) - base
            gray = cv2.cvtColor(np.clip(base, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
            if previous_detail is not None:
                flow = dis.calc(gray, previous_gray, None)
                carried = cv2.remap(previous_detail, x + flow[..., 0], y + flow[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
                raw_flicker.append(float(np.abs(detail - carried).mean()))
                detail = (1 - DETAIL_MEMORY) * detail + DETAIL_MEMORY * carried
                kept_flicker.append(float(np.abs(detail - carried).mean()))
            previous_detail, previous_gray = detail, gray
            out = base + DETAIL * detail
        blurred = cv2.GaussianBlur(out, (0, 0), 1.2)
        result.append(np.clip(out + SHARPEN * (out - blurred), 0, 255).astype(np.uint8))
    if raw_flicker:
        print(f"scintillement du détail : {np.mean(raw_flicker):.2f} sans lissage, {np.mean(kept_flicker):.2f} avec")
    return result


def to_pil(frame: np.ndarray) -> Image.Image:
    return Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))


def portrait(image: Image.Image) -> Image.Image:
    width = round(image.height * 3 / 4)
    left = min(max(round(image.width * BOUQUET_X - width / 2), 0), image.width - width)
    return image.crop((left, 0, left + width, image.height)).resize(FORMATS["portrait"]["size"], Image.LANCZOS)


def write(frames: list[np.ndarray]) -> None:
    totals = dict.fromkeys(FORMATS, 0)
    for name in FORMATS:
        shutil.rmtree(OUT / name, ignore_errors=True)
        (OUT / name).mkdir(parents=True)
    for number, frame in enumerate(frames, start=1):
        image = to_pil(frame)
        for name, settings in FORMATS.items():
            if name == "portrait":
                result = portrait(image)
            else:
                result = image if image.size == settings["size"] else image.resize(settings["size"], Image.LANCZOS)
            path = OUT / name / f"{number:04d}.webp"
            result.save(path, "WEBP", quality=settings["quality"], method=6)
            totals[name] += path.stat().st_size
    for name, total in totals.items():
        print(f"{name} : {len(frames)} images {FORMATS[name]['size']}, {total / 1_000_000:.2f} Mo")


def compare(original: np.ndarray, final: np.ndarray) -> None:
    """Le même détail, avant (agrandissement classique) et après, côte à côte, à taille réelle."""
    CONTROL.mkdir(parents=True, exist_ok=True)
    before = cv2.resize(original, SIZE, interpolation=cv2.INTER_LANCZOS4)
    box = (720, 160, 1320, 760)  # le cœur du bouquet, en pixels de l'image 1920 px
    crops = [to_pil(img).crop(box) for img in (before, final)]
    sheet = Image.new("RGB", (crops[0].width * 2 + 20, crops[0].height), "white")
    sheet.paste(crops[0], (0, 0))
    sheet.paste(crops[1], (crops[0].width + 20, 0))
    path = CONTROL / "hero-avant-apres.jpg"
    sheet.save(path, quality=92)
    print(f"avant / après : {path.relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--esrgan", type=Path, help="chemin de realesrgan-ncnn-vulkan.exe")
    args = parser.parse_args()
    frames = read_frames()
    final = combine(frames, upscale(frames, args.esrgan))
    write(final)
    compare(frames[-1], final[-1])


if __name__ == "__main__":
    main()
