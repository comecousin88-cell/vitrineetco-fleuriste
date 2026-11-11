"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Le seul mouvement de la page Deuil : chaque bloc marqué data-fade apparaît par un fondu lent, sans déplacement.
// L'état de départ est dans globals.css (html[data-anim] [data-fade]:not([data-revealed])). Une fois apparu, le bloc
// reçoit data-revealed et reste visible pour de bon. Sans animation, tout est simplement là.
export function useSlowFade(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const reveal = (element: HTMLElement) => element.setAttribute("data-revealed", "");

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-fade]", scope.current).forEach((element) => {
          if (element.hasAttribute("data-revealed")) return;
          gsap.fromTo(
            element,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1.6,
              ease: "sine.out",
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
              onComplete: () => {
                reveal(element);
                gsap.set(element, { clearProps: "opacity" });
              },
            },
          );
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-fade]", scope.current).forEach(reveal);
      });
    },
    { scope },
  );
}
