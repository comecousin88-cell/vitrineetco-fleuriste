"""Prépare les fleurs qui s'ouvrent, dans la section des saisons : une séquence d'images par fleur.

Installation, une fois :  pip install pillow numpy opencv-python-headless
Lancement :               python scripts/prepare_eclosions.py

Pour chaque vidéo source/eclosion-<fleur>.mp4 présente :
1. On mesure le mouvement d'une image à l'autre. Les images isolées qui sautent (un raté de la vidéo) sont écartées.
2. On coupe le début et la fin immobiles : on garde le passage du bouton fermé à la fleur ouverte.
3. On choisit COUNT images réparties selon la progression de l'ouverture, et non selon le temps : la fleur s'ouvre
   d'un pas régulier, sans à-coup, quelle que soit la vitesse de la vidéo d'origine. C'est ce qui l'accélère pour
   la section.
4. Export d'un carré centré sur la fleur, assez large pour la fleur ouverte, en WebP, dans public/eclosion/<fleur>/0001.webp…

Le script écrit src/data/eclosions.json (le nombre d'images de chaque fleur). Une fleur absente de cette liste
garde, sur le site, son repli : un zoom lent sur un détail de la photo de saison. Il suffit donc de déposer
eclosion-dahlia.mp4 ou eclosion-amaryllis.mp4 dans source/ et de relancer ce script.
Une planche de contrôle est écrite dans source/_controle/eclosion-<fleur>.jpg.
"""
import json
import shutil
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "source"
OUT = ROOT / "public" / "eclosion"
CONTROL = ROOT / "source" / "_controle"
MANIFEST = ROOT / "src" / "data" / "eclosions.json"
FLEURS = ["tulipe", "pivoine", "dahlia", "amaryllis"]

COUNT = 60  # une image tous les 20 px environ pendant que le panneau de la saison arrive
SIZE = 720  # le carré exporté, en pixels
WIDEN = 1.3  # la largeur gardée, en part de la hauteur de la vidéo
QUALITY = 78
TRIM_START = 0.015  # on coupe tant que moins de 1,5 % du mouvement total a eu lieu…
TRIM_END = 0.975  # … et dès que 97,5 % ont eu lieu : la fleur est ouverte, plus rien ne bouge
OUTLIER = 2.5  # une image qui s'écarte 2,5 fois plus de ses voisines qu'elles ne s'écartent entre elles est un raté


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


def pick_by_progress(frames: list[np.ndarray]) -> list[np.ndarray]:
    grays = [small(frame) for frame in frames]
    steps = np.array([0.0] + [difference(grays[i - 1], grays[i]) for i in range(1, len(grays))])
    progress = np.cumsum(steps) / max(steps.sum(), 1e-6)
    start = int(np.searchsorted(progress, TRIM_START))
    end = int(np.searchsorted(progress, TRIM_END))
    # Des cibles régulièrement espacées dans la progression : chaque image avance la fleur d'autant que la précédente.
    targets = np.linspace(progress[start], progress[end], COUNT)
    indices = [int(np.argmin(np.abs(progress - target))) for target in targets]
    return [frames[index] for index in indices]


def square(frame: np.ndarray) -> Image.Image:
    """Un carré centré sur la fleur, un peu plus large que la hauteur de la vidéo : la fleur ouverte y tient en
    entier. Le fond uni est prolongé en haut et en bas pour compléter le carré, sans que cela se voie."""
    height, width = frame.shape[:2]
    side = min(width, round(height * WIDEN))
    left = (width - side) // 2
    crop = frame[:, left : left + side]
    pad = (side - height) // 2
    if pad > 0:
        crop = cv2.copyMakeBorder(crop, pad, side - height - pad, 0, 0, cv2.BORDER_REPLICATE)
    return Image.fromarray(cv2.cvtColor(cv2.resize(crop, (SIZE, SIZE), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB))


def control_sheet(name: str, images: list[Image.Image]) -> None:
    CONTROL.mkdir(parents=True, exist_ok=True)
    picks = [images[round(i * (len(images) - 1) / 7)] for i in range(8)]
    sheet = Image.new("RGB", (8 * 180, 180), "white")
    for index, image in enumerate(picks):
        sheet.paste(image.resize((180, 180)), (index * 180, 0))
    sheet.save(CONTROL / f"eclosion-{name}.jpg", quality=88)


def main() -> None:
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
        picked = [square(frame) for frame in pick_by_progress(cleaned)]
        shutil.rmtree(target, ignore_errors=True)
        target.mkdir(parents=True)
        total = 0
        for number, image in enumerate(picked, start=1):
            out = target / f"{number:04d}.webp"
            image.save(out, "WEBP", quality=QUALITY, method=6)
            total += out.stat().st_size
        control_sheet(name, picked)
        manifest[name] = len(picked)
        removed = len(frames) - len(cleaned)
        print(f"{name} : {len(frames)} images lues, {removed} ratées écartées, {len(picked)} gardées, {total // 1024} Ko")
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
