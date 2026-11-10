"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Photo from "@/components/Photo";
import { BOUTIQUE } from "@/data/boutique";
import { PRODUCTEURS } from "@/data/fleuriste";
import styles from "./Fleuriste.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Fleuriste() {
  const root = useRef<HTMLElement>(null);

  // Le portrait et la photo de la boutique glissent doucement, comme les univers.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-drift] [data-photo-layer]", root.current).forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -5 },
            { yPercent: 5, ease: "none", scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="fleuriste" ref={root} className={styles.section} aria-labelledby="fleuriste-title">
      <div className={styles.top}>
        <div className={styles.portrait} data-drift>
          <Photo
            src="/fleuriste/portrait.webp"
            file="fleuriste-portrait.jpg"
            alt={`${BOUTIQUE.fleuriste}, la fleuriste, au travail derrière son plan de travail.`}
            sizes="(min-width: 760px) 40vw, 100vw"
            className={styles.portraitPhoto}
            layerClassName={styles.layer}
          />
        </div>

        <div className={styles.text}>
          <h2 id="fleuriste-title" className={styles.title}>
            Je m&apos;appelle {BOUTIQUE.fleuriste}
          </h2>
          <p className={styles.lead}>
            J&apos;ai ouvert la boutique en 2019, après dix ans chez un grossiste. J&apos;achète presque tout à trois producteurs que je connais par
            leur prénom.
          </p>

          <ul className={styles.producers} aria-label="Mes producteurs">
            {PRODUCTEURS.map(({ slug, nom, lieu, fleurs, distance, alt }) => (
              <li key={slug} className={styles.producer}>
                <Photo src={`/fleuriste/producteur-${slug}.webp`} file={`producteur-${slug}.jpg`} alt={alt} ratio="1 / 1" sizes="7rem" className={styles.producerPhoto} />
                <div>
                  <p className={styles.producerName}>
                    {nom}, {lieu}
                  </p>
                  <p className={styles.producerFlowers}>{fleurs}</p>
                </div>
                <p className={styles.distance}>{distance}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figure className={styles.shop} data-drift>
        <Photo
          src="/fleuriste/boutique-interieur.webp"
          file="boutique-interieur.jpg"
          alt="L'intérieur de la boutique : seaux en zinc, plantes suspendues, comptoir en chêne."
          sizes="100vw"
          className={styles.shopPhoto}
          layerClassName={styles.layer}
        />
        <figcaption className={styles.caption}>
          La boutique, {BOUTIQUE.street}. Entrez, même pour regarder.
        </figcaption>
      </figure>
    </section>
  );
}
