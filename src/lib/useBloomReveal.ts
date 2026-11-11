"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Le dévoilement « fleur qui s'ouvre » : à son arrivée à l'écran, chaque photo marquée data-bloom apparaît
// par un cercle qui s'élargit depuis son centre, pendant que l'image se pose (léger zoom arrière).
// L'état de départ est dans globals.css (html[data-anim] [data-bloom]:not([data-revealed])) : rien ne clignote au
// chargement. Une fois ouverte, la photo reçoit data-revealed et le reste pour de bon, quel que soit le sens du
// défilement ou le survol. Sans animation (prefers-reduced-motion), le repère data-anim est absent et les photos
// sont simplement là.
// attribute : un autre repère pour un bloc qui gère ses propres photos (la galerie, qui se recompose selon la
// largeur de l'écran) ; dependencies : ce qui, en changeant, recrée ces photos.
export function useBloomReveal(scope: RefObject<HTMLElement | null>, { attribute = "data-bloom", dependencies = [] as unknown[] } = {}) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const reveal = (element: HTMLElement) => element.setAttribute("data-revealed", "");

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(`[${attribute}]`, scope.current).forEach((element) => {
          if (element.hasAttribute("data-revealed")) return;
          const layer = element.querySelector<HTMLElement>("[data-photo-layer] > *, img");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
            // Le repère d'abord, puis on rend la main au CSS : la photo ne peut plus se refermer.
            onComplete: () => {
              reveal(element);
              gsap.set(element, { clearProps: "clipPath" });
              if (layer) gsap.set(layer, { clearProps: "transform" });
            },
          });
          tl.fromTo(element, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1.15, ease: "power3.out" });
          if (layer) tl.fromTo(layer, { scale: 1.14 }, { scale: 1, duration: 1.5, ease: "power3.out" }, 0);
        });
      });
      // Si la préférence change en cours de visite, on montre tout.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(`[${attribute}]`, scope.current).forEach(reveal);
      });
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
