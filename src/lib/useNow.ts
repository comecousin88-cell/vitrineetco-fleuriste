"use client";

import { useSyncExternalStore } from "react";

// L'heure, rafraîchie à chaque minute pleine : le badge passe de « Ouvert » à « Fermé » sans recharger la page.
// Côté serveur, elle vaut null : les horaires dépendent de l'instant de la visite, pas de celui du rendu.
let current: Date | null = null;
const listeners = new Set<() => void>();
let timer: number | undefined;

function tick() {
  current = new Date();
  listeners.forEach((listener) => listener());
  timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.clearTimeout(timer);
    timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.clearTimeout(timer);
  };
}

const getSnapshot = () => (current ??= new Date());
const getServerSnapshot = () => null;

export const useNow = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
