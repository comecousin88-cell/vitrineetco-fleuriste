import type { Bouquet, Couleur, Occasion, Taille } from "@/data/bouquets";

export type Budget = "moins-40" | "40-60" | "plus-60";
export type Filters = { occasion: Occasion | null; couleur: Couleur | null; budget: Budget | null };

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "anniversaire", label: "Anniversaire" },
  { id: "merci", label: "Merci" },
  { id: "amour", label: "Amour" },
  { id: "naissance", label: "Naissance" },
];

// La pastille de chaque couleur, pour la reconnaître d'un coup d'œil.
export const COULEURS: { id: Couleur; label: string; swatch: string }[] = [
  { id: "blanc", label: "Blanc", swatch: "#f7f6f1" },
  { id: "pastel", label: "Pastel", swatch: "#f3d9cf" },
  { id: "rose", label: "Rose", swatch: "#e2a0ad" },
  { id: "rouge", label: "Rouge", swatch: "#a3263b" },
  { id: "orange", label: "Orange", swatch: "#cf7a3f" },
  { id: "vert", label: "Vert", swatch: "#6f8a62" },
  { id: "multicolore", label: "Multicolore", swatch: "conic-gradient(#e2a0ad, #e8c45a, #8fb3d9, #9bc28a, #e2a0ad)" },
];

export const BUDGETS: { id: Budget; label: string; min: number; max: number }[] = [
  { id: "moins-40", label: "Moins de 40 €", min: 0, max: 39.99 },
  { id: "40-60", label: "40 à 60 €", min: 40, max: 60 },
  { id: "plus-60", label: "Plus de 60 €", min: 60.01, max: Infinity },
];

export const NO_FILTERS: Filters = { occasion: null, couleur: null, budget: null };

const TAILLES: Taille[] = ["S", "M", "L"];

// Les tailles d'un bouquet qui entrent dans le budget choisi (toutes, sans budget).
export function sizesInBudget(bouquet: Bouquet, budget: Budget | null) {
  if (!budget) return TAILLES;
  const { min, max } = BUDGETS.find(({ id }) => id === budget)!;
  return TAILLES.filter((taille) => bouquet.prix[taille] >= min && bouquet.prix[taille] <= max);
}

export function matches(bouquet: Bouquet, { occasion, couleur, budget }: Filters) {
  if (occasion && !bouquet.occasions.includes(occasion)) return false;
  if (couleur && bouquet.couleur !== couleur) return false;
  return sizesInBudget(bouquet, budget).length > 0;
}

// Le libellé d'un filtre actif, pour proposer de le retirer quand rien ne correspond.
export function filterLabel(key: keyof Filters, value: string) {
  const list = key === "occasion" ? OCCASIONS : key === "couleur" ? COULEURS : BUDGETS;
  return list.find(({ id }) => id === value)?.label ?? value;
}
