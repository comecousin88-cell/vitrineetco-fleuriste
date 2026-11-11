"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Le seul mouvement de la page Deuil : chaque bloc marqué data-fade apparaît par un fondu lent, sans déplacement.
// L'état de départ est dans globals.css (html[data-anim] [data-fade]). Sans animation, tout est simplement là.
export function useSlowFade(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-fade]", scope.current).forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0 },
            { opacity: 1, duration: 1.6, ease: "sine.out", clearProps: "opacity", scrollTrigger: { trigger: element, start: "top 92%", once: true } },
          );
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-fade]", scope.current), { opacity: 1 });
      });
    },
    { scope },
  );
}
