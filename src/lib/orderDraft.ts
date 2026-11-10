"use client";

import { useSyncExternalStore } from "react";
import { BOUQUETS, type Taille } from "@/data/bouquets";

// Le bouquet choisi avant de remplir la commande : partagé entre la sélection, le hero et le formulaire.
// Une commande = un bouquet, comme chez une fleuriste : choisir un autre bouquet remplace le précédent.
export type Draft = { slug: string; taille: Taille } | null;

let draft: Draft = null;
const listeners = new Set<() => void>();

const isTaille = (value: unknown): value is Taille => value === "S" || value === "M" || value === "L";

export function setDraft(slug: string, taille: Taille = "M") {
  if (!BOUQUETS.some((bouquet) => bouquet.slug === slug)) return;
  draft = { slug, taille };
  listeners.forEach((listener) => listener());
}

export function setDraftSize(taille: Taille) {
  if (!draft) return;
  draft = { ...draft, taille };
  listeners.forEach((listener) => listener());
}

// Lit ?bouquet=le-coin&taille=M, pour qu'un lien partagé ou venu d'une autre page arrive prérempli.
export function readDraftFromUrl(search: string) {
  const params = new URLSearchParams(search);
  const slug = params.get("bouquet");
  const taille = params.get("taille");
  if (slug) setDraft(slug, isTaille(taille) ? taille : "M");
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useDraft = () => useSyncExternalStore(subscribe, () => draft, () => null);
