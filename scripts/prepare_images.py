"""Prépare les photos de source/ pour le site : même traitement léger partout, export WebP dans public/.

Installation, une fois :  pip install pillow
Lancement :               python scripts/prepare_images.py

Pour chaque photo listée dans PHOTOS ci-dessous, si l'original existe dans source/ (en .jpg, .jpeg ou .png) :
1. Redimensionnement à la largeur maximale utile (le site n'affiche jamais plus grand).
2. Le même traitement léger pour toutes : un soupçon de contraste, couleurs à peine adoucies, netteté fine
   après réduction. Rien qui change la lumière d'origine.
3. Export WebP qualité 82 dans public/, au chemin attendu par le site.

Le script écrit ensuite src/data/photos.json : la liste des photos prêtes et leurs dimensions. Une photo absente
de cette liste s'affiche sur le site en emplacement provisoire, avec le nom du fichier attendu.
Une nouvelle version d'une photo ? La déposer dans source/ sous le même nom et relancer le script.
"""
import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "source"
PUBLIC = ROOT / "public"
MANIFEST = ROOT / "src" / "data" / "photos.json"
QUALITY = 82

PORTRAIT = 1600  # 4:5 : affichées au plus sur un tiers d'écran
WIDE = 2400  # 16:9 et 3:2 : affichées sur toute la largeur
MEDIUM = 2200  # 5:4 : les grands tirages de « Nos univers »
SQUARE = 1600

# Nom de l'original dans source/ (sans extension) -> chemin dans public/, largeur maximale.
PHOTOS = {
    # Hero : l'affiche, la dernière image nette de hero-ruban.mp4 agrandie en 2560 px (bouquet noué).
    "hero-fin": ("hero/fin.webp", WIDE),
    # Catalogue
    **{f"bouquet-{slug}": (f"bouquets/{slug}.webp", PORTRAIT) for slug in (
        "le-coin", "petit-matin", "joue-rose", "terre-cuite", "grand-amour", "champ-libre", "douceur", "sous-bois",
    )},
    # Nos univers
    "univers-bouquets": ("univers/bouquets.webp", MEDIUM),
    "univers-ateliers": ("univers/ateliers.webp", MEDIUM),
    "univers-deuil": ("univers/deuil.webp", PORTRAIT),
    "univers-mariages": ("univers/mariages.webp", PORTRAIT),
    # Les saisons
    **{f"saison-{slug}": (f"saisons/{slug}.webp", PORTRAIT) for slug in ("printemps", "ete", "automne", "hiver")},
    # Deuil
    "deuil-ouverture": ("deuil/ouverture.webp", WIDE),
    **{f"deuil-{slug}": (f"deuil/{slug}.webp", PORTRAIT) for slug in (
        "bouquet-blanc", "coussin", "gerbe", "couronne", "dessus-cercueil",
    )},
    # Mariages & événements
    "mariage-ouverture": ("mariages/mariage-ouverture.webp", WIDE),
    "mariage-arche": ("mariages/mariage-arche.webp", WIDE),
    "mariage-ceremonie": ("mariages/mariage-ceremonie.webp", WIDE),
    "mariage-table": ("mariages/mariage-table.webp", WIDE),
    "mariage-bouquet": ("mariages/mariage-bouquet.webp", PORTRAIT),
    "mariage-boutonniere": ("mariages/mariage-boutonniere.webp", SQUARE),
    "evenement-accueil": ("mariages/evenement-accueil.webp", PORTRAIT),
    "mariage-couronne-cheveux": ("mariages/mariage-couronne-cheveux.webp", PORTRAIT),
    "mariage-centre-de-table": ("mariages/mariage-centre-de-table.webp", PORTRAIT),
    "evenement-vitrine": ("mariages/evenement-vitrine.webp", WIDE),
    # Ateliers
    "ateliers-ouverture": ("ateliers/ateliers-ouverture.webp", WIDE),
    **{f"atelier-{slug}": (f"ateliers/atelier-{slug}.webp", PORTRAIT) for slug in (
        "couronne", "champetre", "centre-de-table", "sec",
    )},
    # Abonnement
    "abonnement-maison": ("abonnement/maison.webp", PORTRAIT),
    "abonnement-entreprise": ("abonnement/entreprise.webp", PORTRAIT),
    # La fleuriste
    "fleuriste-portrait": ("fleuriste/portrait.webp", PORTRAIT),
    "boutique-interieur": ("fleuriste/boutique-interieur.webp", WIDE),
    **{f"producteur-{slug}": (f"fleuriste/producteur-{slug}.webp", 800) for slug in ("serre", "champ", "verger")},
    # Infos
    "boutique-facade": ("infos/boutique-facade.webp", WIDE),
}


def find_original(name: str):
    for extension in (".jpg", ".jpeg", ".png", ".webp"):
        path = SOURCE / f"{name}{extension}"
        if path.exists():
            return path
    return None


def treat(image: Image.Image, max_width: int) -> Image.Image:
    image = ImageOps.exif_transpose(image).convert("RGB")
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.LANCZOS)
    image = ImageEnhance.Contrast(image).enhance(1.03)
    image = ImageEnhance.Color(image).enhance(0.97)
    return image.filter(ImageFilter.UnsharpMask(radius=1.0, percent=35, threshold=3))


def main():
    manifest = {}
    missing = []
    for name, (target, max_width) in PHOTOS.items():
        original = find_original(name)
        if original is None:
            missing.append(name)
            continue
        out = PUBLIC / target
        out.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(original) as image:
            result = treat(image, max_width)
        result.save(out, "WEBP", quality=QUALITY, method=6)
        manifest[f"/{target}"] = {"width": result.width, "height": result.height}
        print(f"{original.name:34s} -> public/{target}  {result.width}x{result.height}  {out.stat().st_size // 1024} Ko")

    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n", encoding="utf-8")
    print(f"\n{len(manifest)} photos prêtes, liste écrite dans {MANIFEST.relative_to(ROOT)}")
    if missing:
        print(f"{len(missing)} encore manquantes (emplacements provisoires) : {', '.join(missing)}")


if __name__ == "__main__":
    main()
