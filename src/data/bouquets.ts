// La sélection du moment. Les photos viendront de source/ (voir docs/proposition.md), toutes dans le même décor.

export type Taille = "S" | "M" | "L";
export type Occasion = "anniversaire" | "merci" | "amour" | "naissance";
export type Couleur = "blanc" | "rose" | "rouge" | "orange" | "pastel" | "multicolore" | "vert";

export type Bouquet = {
  slug: string;
  nom: string;
  fleurs: string;
  couleur: Couleur;
  occasions: Occasion[];
  prix: Record<Taille, number>;
};

export const BOUQUETS: Bouquet[] = [
  {
    slug: "le-coin",
    nom: "Le Coin",
    fleurs: "Renoncule rose poudré, rose de jardin pêche, lisianthus blanc, eucalyptus, graminée",
    couleur: "rose",
    occasions: ["merci", "anniversaire"],
    prix: { S: 35, M: 50, L: 70 },
  },
  {
    slug: "petit-matin",
    nom: "Petit matin",
    fleurs: "Lisianthus et renoncules blancs, gypsophile, feuillage tendre",
    couleur: "blanc",
    occasions: ["naissance", "merci"],
    prix: { S: 32, M: 45, L: 62 },
  },
  {
    slug: "joue-rose",
    nom: "Joue rose",
    fleurs: "Roses framboise, renoncules fuchsia, astrance",
    couleur: "rose",
    occasions: ["amour", "anniversaire"],
    prix: { S: 38, M: 55, L: 78 },
  },
  {
    slug: "terre-cuite",
    nom: "Terre cuite",
    fleurs: "Roses orange brûlé, dahlias café au lait, graminées rousses",
    couleur: "orange",
    occasions: ["anniversaire", "merci"],
    prix: { S: 36, M: 52, L: 72 },
  },
  {
    slug: "grand-amour",
    nom: "Grand amour",
    fleurs: "Roses rouge profond, feuillage sombre, baies",
    couleur: "rouge",
    occasions: ["amour"],
    prix: { S: 45, M: 65, L: 90 },
  },
  {
    slug: "champ-libre",
    nom: "Champ libre",
    fleurs: "Cosmos, matricaire, scabieuses, fleurs des champs",
    couleur: "multicolore",
    occasions: ["anniversaire", "merci"],
    prix: { S: 30, M: 44, L: 60 },
  },
  {
    slug: "douceur",
    nom: "Douceur",
    fleurs: "Lisianthus, renoncules pastel, roses crème et pêche",
    couleur: "pastel",
    occasions: ["naissance", "amour"],
    prix: { S: 34, M: 48, L: 66 },
  },
  {
    slug: "sous-bois",
    nom: "Sous-bois",
    fleurs: "Feuillages, branchages fins, graminées, une fleur blanche",
    couleur: "vert",
    occasions: ["merci"],
    prix: { S: 28, M: 40, L: 55 },
  },
];

// Le bouquet que les mains composent dans la vidéo d'accueil.
export const BOUQUET_SIGNATURE = BOUQUETS[0];

// Le lien qui ouvre la commande avec un bouquet déjà choisi.
export const commanderHref = (slug?: string) => (slug ? `/?bouquet=${slug}#commander` : "/#commander");
