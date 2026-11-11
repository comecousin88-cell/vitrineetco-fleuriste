// Les quatre saisons. Chaque saison a sa photo de boutique et une fleur qui s'ouvre en accéléré
// (séquence d'images préparée par scripts/prepare_eclosions.py à partir de source/eclosion-*.mp4).
// Tant qu'une vidéo manque, la saison garde un repli : un zoom lent sur un détail de sa photo, autour du point
// « detail » (en % du cadre). Dès que le script a préparé la vidéo, elle remplace ce repli d'elle-même.

import eclosions from "./eclosions.json";

const ready: Record<string, number> = eclosions;
const eclosion = (fleur: string) => ({ fleur, folder: `/eclosion/${fleur}`, count: ready[fleur] ?? 0, file: `eclosion-${fleur}.mp4` });

export type Saison = {
  slug: "printemps" | "ete" | "automne" | "hiver";
  nom: string;
  fleurs: string;
  phrase: string;
  fond: string; // la couleur de fond pendant cette saison
  mois: number[]; // les mois (1 à 12) où l'on est dans cette saison, pour la repérer « en ce moment »
  eclosion: { fleur: string; folder: string; count: number; file: string };
  detail: { x: string; y: string }; // le point sur lequel le repli zoome
  alt: string;
};

export const SAISONS: Saison[] = [
  {
    slug: "printemps",
    nom: "Printemps",
    fleurs: "Tulipes et renoncules",
    phrase: "Les premières tulipes arrivent de Seine-et-Marne début mars. Je les vends encore fermées : elles s'ouvrent chez vous.",
    fond: "#eaf0e2",
    mois: [3, 4, 5],
    eclosion: eclosion("tulipe"),
    detail: { x: "36%", y: "72%" },
    alt: "Des seaux de tulipes et de renoncules blanches, roses et jaunes dans la boutique.",
  },
  {
    slug: "ete",
    nom: "Été",
    fleurs: "Pivoines et roses",
    phrase: "En juin, mes pivoines viennent d'un champ près d'Étampes. Elles ne durent que trois semaines, alors j'en mets partout.",
    fond: "#f6e5de",
    mois: [6, 7, 8],
    eclosion: eclosion("pivoine"),
    detail: { x: "30%", y: "72%" },
    alt: "Des seaux débordant de pivoines et de roses de jardin, roses et corail.",
  },
  {
    slug: "automne",
    nom: "Automne",
    fleurs: "Dahlias et feuillages",
    phrase: "Jusqu'aux premières gelées, mes dahlias poussent dans le Vexin. Ensuite, je passe aux feuillages roux et aux branches de chêne.",
    fond: "#f2e4d3",
    mois: [9, 10, 11],
    eclosion: eclosion("dahlia"),
    detail: { x: "46%", y: "68%" },
    alt: "Des seaux de dahlias cuivrés et de feuillages roux, avec des branches de chêne.",
  },
  {
    slug: "hiver",
    nom: "Hiver",
    fleurs: "Branchages, amaryllis, sapin",
    phrase: "L'hiver, les champs dorment. Je compose avec des branchages, du sapin coupé en Île-de-France et quelques amaryllis.",
    fond: "#e5e9e6",
    mois: [12, 1, 2],
    eclosion: eclosion("amaryllis"),
    detail: { x: "36%", y: "60%" },
    alt: "Des branchages nus, des amaryllis rouges et des branches de sapin dans des seaux en zinc.",
  },
];

export const saisonPhoto = (slug: string) => ({
  src: `/saisons/${slug}.webp`,
  file: `saison-${slug}.jpg`,
});

// La saison du mois en cours, à l'heure de Paris.
export function currentSeasonIndex(now: Date) {
  const month = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", month: "numeric" }).format(now));
  return SAISONS.findIndex(({ mois }) => mois.includes(month));
}
