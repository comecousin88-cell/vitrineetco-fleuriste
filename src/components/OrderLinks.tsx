"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/lib/lenis";
import { readDraftFromUrl } from "@/lib/orderDraft";

// Sur l'accueil, les liens « Commander ce bouquet » (/?bouquet=…#commander) ne rechargent pas la page :
// ils choisissent le bouquet et glissent jusqu'à la commande. Venu d'une autre page, le même lien arrive
// avec le bouquet déjà choisi.
export default function OrderLinks() {
  useEffect(() => {
    readDraftFromUrl(window.location.search);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname !== "/" || url.hash !== "#commander") return;
      event.preventDefault();
      readDraftFromUrl(url.search);
      scrollToSection("commander");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
