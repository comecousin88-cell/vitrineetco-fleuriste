// Les compositions de deuil et les lieux de cérémonie. Photos : voir docs/proposition.md, section Deuil.

export type Composition = { slug: string; nom: string; phrase: string; prix: number; alt: string };

export const COMPOSITIONS: Composition[] = [
  {
    slug: "bouquet-blanc",
    nom: "Bouquet blanc",
    phrase: "Rond, blanc et vert, à offrir à la famille ou à poser près du cercueil.",
    prix: 60,
    alt: "Un bouquet rond de fleurs blanches et de feuillage vert.",
  },
  {
    slug: "coussin",
    nom: "Coussin",
    phrase: "Des roses blanches et rose pâle, posé sur le cercueil ou au pied de la tombe.",
    prix: 120,
    alt: "Un coussin de roses blanches et rose pâle.",
  },
  {
    slug: "gerbe",
    nom: "Gerbe",
    phrase: "Longue, avec des roses et des lys blancs et un feuillage argenté.",
    prix: 150,
    alt: "Une gerbe longue de roses et de lys blancs avec un feuillage argenté.",
  },
  {
    slug: "couronne",
    nom: "Couronne",
    phrase: "Sur trépied, en fleurs blanches et vertes, pour l'église ou le funérarium.",
    prix: 220,
    alt: "Une couronne de fleurs blanches et vertes posée sur un trépied.",
  },
  {
    slug: "dessus-cercueil",
    nom: "Dessus de cercueil",
    phrase: "Longue et basse, en blanc et vert tendre, pour la famille proche.",
    prix: 260,
    alt: "Une composition longue et basse de fleurs blanches et vert tendre.",
  },
];

export const compositionPhoto = (slug: string) => ({
  src: `/deuil/${slug}.webp`,
  file: `deuil-${slug}.jpg`,
});

export const LIEUX = [
  { id: "funerarium", label: "Funérarium" },
  { id: "eglise", label: "Lieu de culte" },
  { id: "cimetiere", label: "Cimetière" },
  { id: "domicile", label: "Domicile" },
] as const;

export type LieuType = (typeof LIEUX)[number]["id"];

export const DEUIL = {
  // Je livre au plus tard une heure avant la cérémonie : il faut le temps de préparer.
  delaiHeures: 3, // pour une cérémonie aujourd'hui, au moins 3 heures entre la commande et la cérémonie
  rubanMax: 40,
} as const;
