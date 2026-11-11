"use client";

import { useRef } from "react";
import Photo from "@/components/Photo";
import { UNIVERS, universPhoto } from "@/data/univers";
import { useBloomReveal } from "@/lib/useBloomReveal";
import styles from "./Univers.module.css";

// Quatre grandes entrées. Sur ordinateur, elles forment un accordéon : la carte survolée (ou atteinte au clavier)
// s'élargit, les autres se resserrent. Sur téléphone, de simples cartes empilées. À leur arrivée à l'écran, les
// photos s'ouvrent depuis leur centre.
export default function Univers() {
  const root = useRef<HTMLElement>(null);
  useBloomReveal(root);

  return (
    <section id="univers" ref={root} className={styles.section} aria-labelledby="univers-title">
      <h2 id="univers-title" className={styles.title}>
        Du bouquet du mardi au grand jour
      </h2>
      <ul className={styles.grid}>
        {UNIVERS.map((univers) => {
          const photo = universPhoto(univers.slug);
          return (
            <li key={univers.slug} className={styles.item}>
              <a href={univers.href} className={styles.link}>
                <span className={styles.frame} data-bloom>
                  <Photo src={photo.src} file={photo.file} alt={univers.alt} sizes="(min-width: 1024px) 50vw, 100vw" className={styles.photo} />
                </span>
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
