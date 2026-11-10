// Mariages et événements : ce que je fleuris, la galerie, et les choix de la demande de devis.
// Photos : voir docs/medias.md, section Mariages & événements.

export const PRESTATIONS = [
  { nom: "Bouquet de mariée", prix: "dès 120 €" },
  { nom: "Boutonnières", prix: "dès 15 € pièce" },
  { nom: "Centres de table", prix: "dès 45 € pièce" },
  { nom: "Arche ou décor de cérémonie", prix: "dès 600 €" },
  { nom: "Événement d'entreprise", prix: "sur devis" },
];

export type GalleryItem = { file: string; src: string; ratio: string; alt: string; legende: string };

const item = (name: string, ratio: string, alt: string, legende: string): GalleryItem => ({
  file: `${name}.jpg`,
  src: `/mariages/${name}.webp`,
  ratio,
  alt,
  legende,
});

export const GALERIE: GalleryItem[] = [
  item("mariage-arche", "3 / 2", "Une arche fleurie blanche et verte dans un jardin.", "Une arche blanche et verte, dans un jardin du Perche"),
  item("mariage-bouquet", "4 / 5", "Un bouquet de mariée en cascade tenu à deux mains.", "Le bouquet de mariée, en cascade"),
  item("mariage-boutonniere", "1 / 1", "Une boutonnière sur le revers d'une veste en lin sauge.", "Une boutonnière assortie"),
  item("mariage-table", "3 / 2", "Un centre de table bas avec des verres et un linge de lin.", "Des centres de table bas, pour se voir d'un bout à l'autre"),
  item("mariage-ceremonie", "4 / 5", "Une allée de cérémonie bordée de bouquets dans des seaux.", "Une allée de seaux fleuris"),
  item("evenement-accueil", "4 / 5", "Une grande composition sur un comptoir d'accueil d'entreprise.", "L'accueil d'une entreprise, renouvelé chaque semaine"),
  item("mariage-couronne-cheveux", "4 / 5", "Une couronne de fleurs fraîches dans des cheveux attachés, vue de dos.", "Une couronne de fleurs fraîches"),
  item("mariage-centre-de-table", "4 / 5", "Un centre de table haut dans un vase en verre, à la lumière des bougies.", "Un centre de table haut, pour un dîner"),
  item("evenement-vitrine", "3 / 2", "Une vitrine de boutique décorée de fleurs pour un lancement.", "La vitrine d'une boutique voisine, pour son lancement"),
];

export const TYPES_EVENEMENT = ["Mariage", "Fête de famille", "Entreprise", "Autre"] as const;

export const BUDGETS_DEVIS = ["Moins de 1 000 €", "1 000 à 2 500 €", "2 500 à 5 000 €", "Plus de 5 000 €", "Je ne sais pas encore"] as const;

export const DEVIS = {
  // Il faut du temps pour commander les fleurs : en dessous, mieux vaut appeler.
  delaiMinJours: 21,
  delaiMaxJours: 730,
  enviesMax: 800,
  photoMaxMo: 8,
} as const;
