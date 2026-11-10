"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Photo from "@/components/Photo";
import { UNIVERS, universPhoto } from "@/data/univers";
import styles from "./Univers.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Quatre grandes entrées, posées en quinconce comme des tirages sur une table. La photo glisse doucement
// dans son cadre pendant le défilement, comme vue à travers une vitrine.
export default function Univers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-photo-layer]", root.current).forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="univers" ref={root} className={styles.section} aria-labelledby="univers-title">
      <h2 id="univers-title" className={styles.title}>
        Du bouquet du mardi au grand jour
      </h2>
      <ul className={styles.grid}>
        {UNIVERS.map((univers) => {
          const photo = universPhoto(univers.slug);
          return (
            <li key={univers.slug} className={`${styles.item} ${styles[univers.slug]}`}>
              <a href={univers.href} className={styles.link}>
                <Photo
                  src={photo.src}
                  file={photo.file}
                  alt={univers.alt}
                  sizes="(min-width: 760px) 50vw, 100vw"
                  className={styles.photo}
                  layerClassName={styles.layer}
                />
                <span className={styles.text}>
                  <span className={styles.name}>{univers.titre}</span>
                  <span className={styles.phrase}>{univers.phrase}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
