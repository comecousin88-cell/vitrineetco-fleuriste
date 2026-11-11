"use client";

import { useEffect } from "react";
import { addFromUrl } from "@/lib/cart";
import { scrollToSection } from "@/lib/lenis";

// Sur l'accueil, les liens « Commander ce bouquet » (/?bouquet=…#commander) ne rechargent pas la page :
// ils ajoutent le bouquet au panier et glissent jusqu'à la commande. Venu d'une autre page, le même lien arrive
// avec le bouquet ajouté ; l'adresse est ensuite nettoyée, pour qu'un rechargement ne l'ajoute pas une seconde fois.
export default function OrderLinks() {
  useEffect(() => {
    if (window.location.search.includes("bouquet=")) {
      addFromUrl(window.location.search);
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname !== "/" || url.hash !== "#commander") return;
      event.preventDefault();
      addFromUrl(url.search);
      scrollToSection("commander");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
