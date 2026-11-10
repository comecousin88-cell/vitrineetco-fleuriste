// L'abonnement : un bouquet de saison livré chaque semaine ou toutes les deux semaines.
// Photos : abonnement-maison.jpg et abonnement-entreprise.jpg (voir docs/medias.md).

export type Public = "particulier" | "entreprise";
export type Formule = { id: string; nom: string; detail: string; prix: number | null }; // null : sur devis

export const FORMULES: Record<Public, Formule[]> = {
  particulier: [
    { id: "petit", nom: "Le petit", detail: "Pour une table de cuisine ou une table de nuit", prix: 30 },
    { id: "moyen", nom: "Le moyen", detail: "Pour le salon, le plus choisi", prix: 42 },
    { id: "genereux", nom: "Le généreux", detail: "Pour une entrée ou une grande table", prix: 58 },
  ],
  entreprise: [
    { id: "comptoir", nom: "Comptoir", detail: "Un bouquet pour un accueil ou une caisse", prix: 55 },
    { id: "accueil", nom: "Grand accueil", detail: "Une grande composition dans votre vase ou le mien", prix: 85 },
    { id: "plusieurs", nom: "Plusieurs pièces", detail: "Bureaux, salles de réunion, restaurant", prix: null },
  ],
};

export const RYTHMES = [
  { id: "hebdo", label: "Chaque semaine", parMois: 4.33 },
  { id: "quinzaine", label: "Toutes les deux semaines", parMois: 2.17 },
] as const;

export type RythmeId = (typeof RYTHMES)[number]["id"];

export const JOURS_LIVRAISON = [
  { id: "mardi", label: "Le mardi" },
  { id: "vendredi", label: "Le vendredi" },
] as const;

export const PHOTOS: Record<Public, { src: string; file: string; alt: string }> = {
  particulier: {
    src: "/abonnement/maison.webp",
    file: "abonnement-maison.jpg",
    alt: "Un bouquet de saison dans un pichet en grès, sur une table de cuisine, au matin.",
  },
  entreprise: {
    src: "/abonnement/entreprise.webp",
    file: "abonnement-entreprise.jpg",
    alt: "Un grand bouquet de saison sur le comptoir d'un bureau lumineux.",
  },
};
