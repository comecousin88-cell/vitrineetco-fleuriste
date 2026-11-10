"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Lenis et GSAP partagent la même horloge : sinon l'animation et le défilement se décalent et l'image tremble.
export default function SmoothScroll() {
  useEffect(() => {
    // Un visiteur qui demande moins d'animations garde le défilement natif.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // anchors : les liens internes (Commander, Les saisons) glissent jusqu'à leur section.
    const lenis = new Lenis({ lerp: 0.12, anchors: { duration: 1.1 } });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Dès que la page change de hauteur (un message d'erreur, un champ qui s'ouvre, la confirmation, les
    // polices), les animations plus bas recalculent leur position. Sinon elles démarreraient décalées.
    let timer: number | undefined;
    let lastHeight = 0;
    const refreshSoon = (height: number) => {
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    // On observe <body> : il reste le même quand on change de page, contrairement à <main>.
    const page = document.body;
    const observer = new ResizeObserver(() => refreshSoon(page.offsetHeight));
    lastHeight = page.offsetHeight;
    observer.observe(page);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
