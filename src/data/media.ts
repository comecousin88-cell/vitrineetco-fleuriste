import photos from "./photos.json";

// La séquence du hero, découpée et agrandie (Real-ESRGAN) par scripts/prepare_hero.py, à partir de
// source/hero-composition.mp4. Trois séries de fichiers 0001.webp, 0002.webp… : hd (1920 px, grands écrans),
// landscape (1280 px) et portrait (téléphones).
// Si le nombre d'images change dans le script, le reporter ici. À 0, le site affiche un emplacement provisoire.
export const HERO_FRAMES = {
  folder: "/hero",
  count: 96,
  hdFromWidth: 1500, // à partir de cette largeur en pixels réels, la série en 1920 px
  source: "hero-composition.mp4",
} as const;

// L'image finale du hero : affiche, version sans animation, et fond avant que la séquence n'arrive.
// Provisoirement la dernière image de la vidéo, en attendant hero-ruban.mp4 et le nouveau hero-fin.
export const HERO_POSTER = { src: "/hero/fin.webp", file: "hero-fin.jpg" } as const;

export const PHOTO_QUALITY = 82;

// Les photos déjà préparées dans public/ et leurs dimensions, écrites par scripts/prepare_images.py.
// Une photo absente de cette liste s'affiche en emplacement provisoire, avec le nom du fichier attendu.
export const PHOTOS: Record<string, { width: number; height: number }> = photos;
export const isReady = (src: string) => src in PHOTOS;

// Le chemin d'une photo de bouquet dans public/, et le nom de son original dans source/.
export const bouquetPhoto = (slug: string) => ({
  src: `/bouquets/${slug}.webp`,
  file: `bouquet-${slug}.jpg`,
});
