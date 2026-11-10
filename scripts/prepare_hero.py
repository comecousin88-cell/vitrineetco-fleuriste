"""Découpe la vidéo du hero en séquence d'images que le scroll fait avancer.

Installation, une fois :  pip install pillow opencv-python-headless
Lancement :               python scripts/prepare_hero.py

Lit source/hero-composition.mp4 (et, quand il existera, source/hero-ruban.mp4 à la suite), garde COUNT images
réparties régulièrement, et écrit deux séries dans public/hero/ :
- landscape/ : l'image entière, pour les écrans en largeur ;
- portrait/ : une bande verticale 3:4 centrée sur le bouquet, agrandie proprement, pour les téléphones. Elle est
  plus large que l'écran d'un téléphone : le site la recadre selon sa forme, bouquet au centre.
Les fichiers s'appellent 0001.webp, 0002.webp, etc. Si COUNT change, le reporter dans HERO_FRAMES
(src/data/media.ts). La dernière image sert aussi d'affiche : voir prepare_images.py (hero/fin.webp).
"""
import shutil
from pathlib import Path

import cv2
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [ROOT / "source" / "hero-composition.mp4", ROOT / "source" / "hero-ruban.mp4"]
OUT = ROOT / "public" / "hero"
COUNT = 80  # environ une image tous les 14 px de défilement : le mouvement reste fluide
QUALITY = 78
BOUQUET_X = 0.5  # le centre du bouquet, du début à la fin, en part de la largeur de l'image
PORTRAIT_HEIGHT = 1080  # la bande verticale est agrandie à cette hauteur


def read_frames():
    frames = []
    for path in SOURCES:
        if not path.exists():
            continue
        capture = cv2.VideoCapture(str(path))
        while True:
            ok, frame = capture.read()
            if not ok:
                break
            frames.append(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
        capture.release()
        print(f"{path.name} : lue")
    return frames


def portrait(image: Image.Image) -> Image.Image:
    width = round(image.height * 3 / 4)
    left = min(max(round(image.width * BOUQUET_X - width / 2), 0), image.width - width)
    band = image.crop((left, 0, left + width, image.height))
    size = (round(width * PORTRAIT_HEIGHT / image.height), PORTRAIT_HEIGHT)
    return band.resize(size, Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))


def main():
    frames = read_frames()
    if not frames:
        raise SystemExit("Aucune vidéo trouvée dans source/.")
    picks = [round(i * (len(frames) - 1) / (COUNT - 1)) for i in range(COUNT)]

    for series in ("landscape", "portrait", "hd"):
        shutil.rmtree(OUT / series, ignore_errors=True)
    (OUT / "landscape").mkdir(parents=True)
    (OUT / "portrait").mkdir(parents=True)

    total = 0
    for number, index in enumerate(picks, start=1):
        image = frames[index]
        for series, result in (("landscape", image), ("portrait", portrait(image))):
            path = OUT / series / f"{number:04d}.webp"
            result.save(path, "WEBP", quality=QUALITY, method=6)
            total += path.stat().st_size
    print(f"{len(frames)} images lues, {COUNT} gardées par série ({frames[0].width}x{frames[0].height}), {total // 1024} Ko au total")


if __name__ == "__main__":
    main()
