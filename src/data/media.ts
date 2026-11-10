// Les séquences d'images. Chaque dossier contient une série par format (landscape, portrait, hd), avec des
// fichiers 0001.webp, 0002.webp, etc., préparés par les scripts de scripts/ à partir des originaux de source/.
// Tant qu'une série n'est pas prête, count vaut 0 et le site affiche un emplacement provisoire.

export const HERO_FRAMES = {
  folder: "/hero",
  count: 0,
  hdFromWidth: 1700, // à partir de cette largeur en pixels réels, la série en 1920 px
  source: "hero-composition.mp4 + hero-ruban.mp4",
} as const;

export const PHOTO_QUALITY = 82;

// Les photos déjà préparées dans public/. Une photo absente de cette liste s'affiche en emplacement
// provisoire, avec le nom du fichier attendu dans source/. Il suffit d'ajouter son chemin ici une fois prête.
export const READY_PHOTOS = new Set<string>([]);

// Le chemin d'une photo de bouquet dans public/, et le nom de son original dans source/.
export const bouquetPhoto = (slug: string) => ({
  src: `/bouquets/${slug}.webp`,
  file: `bouquet-${slug}.jpg`,
});
