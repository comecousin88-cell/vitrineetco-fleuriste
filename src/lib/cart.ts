"use client";

import { useSyncExternalStore } from "react";
import { BOUQUETS, type Taille } from "@/data/bouquets";

// Le panier : les bouquets choisis, livrés ensemble. Il est gardé dans le navigateur du visiteur, pour survivre
// au passage d'une page à l'autre ; s'il n'est pas lisible (navigation privée stricte), il vit le temps de la page.
export type CartItem = { slug: string; taille: Taille; qty: number };

const KEY = "fleur-du-coin:panier";
const MAX_QTY = 9;
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const isTaille = (value: unknown): value is Taille => value === "S" || value === "M" || value === "L";

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(parsed)) {
      items = parsed.filter(
        (item): item is CartItem =>
          BOUQUETS.some(({ slug }) => slug === item?.slug) && isTaille(item?.taille) && Number.isInteger(item?.qty) && item.qty > 0,
      );
    }
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Pas de stockage : le panier reste en mémoire.
  }
  listeners.forEach((listener) => listener());
}

const same = (item: CartItem, slug: string, taille: Taille) => item.slug === slug && item.taille === taille;

// Ajoute un bouquet. La même taille du même bouquet s'additionne sur une seule ligne.
export function addToCart(slug: string, taille: Taille = "M") {
  load();
  if (!BOUQUETS.some((bouquet) => bouquet.slug === slug)) return;
  const existing = items.find((item) => same(item, slug, taille));
  commit(
    existing
      ? items.map((item) => (item === existing ? { ...item, qty: Math.min(item.qty + 1, MAX_QTY) } : item))
      : [...items, { slug, taille, qty: 1 }],
  );
}

export function setQty(slug: string, taille: Taille, qty: number) {
  load();
  commit(qty <= 0 ? items.filter((item) => !same(item, slug, taille)) : items.map((item) => (same(item, slug, taille) ? { ...item, qty: Math.min(qty, MAX_QTY) } : item)));
}

export function clearCart() {
  commit(EMPTY);
}

// Lit ?bouquet=le-coin&taille=M : un lien « Commander ce bouquet » ajoute le bouquet au panier.
export function addFromUrl(search: string) {
  const params = new URLSearchParams(search);
  const slug = params.get("bouquet");
  const taille = params.get("taille");
  if (slug) addToCart(slug, isTaille(taille) ? taille : "M");
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // Un autre onglet a changé le panier : on suit.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const getSnapshot = () => {
  load();
  return items;
};

export const useCart = () => useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
export const cartCount = (list: CartItem[]) => list.reduce((total, item) => total + item.qty, 0);
export const MAX_PER_LINE = MAX_QTY;
