"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DevisForm from "@/components/DevisForm";
import Gallery from "@/components/Gallery";
import Photo from "@/components/Photo";
import { PRESTATIONS } from "@/data/mariages";
import styles from "./Mariages.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Mariages() {
  const root = useRef<HTMLDivElement>(null);

  // La grande photo d'ouverture glisse doucement dans son cadre, comme les univers de l'accueil.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const [layer] = gsap.utils.toArray<HTMLElement>("[data-opening] [data-photo-layer]", root.current);
        if (!layer) return;
        gsap.fromTo(
          layer,
          { yPercent: -4 },
          { yPercent: 4, ease: "none", scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className={styles.intro} aria-labelledby="mariages-title">
        <div className={styles.introHead}>
          <h1 id="mariages-title" className={styles.title}>
            Mariages & événements
          </h1>
          <p className={styles.lead}>
            De l&apos;arche à la boutonnière, je fleuris mariages, fêtes de famille et événements d&apos;entreprise. Tout commence par un café à la
            boutique.
          </p>
        </div>
        <div data-opening>
          <Photo
            src="/mariages/mariage-ouverture.webp"
            file="mariage-ouverture.jpg"
            alt="Une longue table de banquet dans un jardin, avec un chemin de fleurs blanches et vertes et des bougies."
            sizes="100vw"
            className={styles.opening}
            layerClassName={styles.openingLayer}
            priority
          />
        </div>
      </section>

      <section className={styles.prestations} aria-labelledby="prestations-title">
        <h2 id="prestations-title" className={styles.h2}>
          Pour vous donner une idée
        </h2>
        <dl className={styles.prices}>
          {PRESTATIONS.map(({ nom, prix }) => (
            <div key={nom}>
              <dt>{nom}</dt>
              <dd>{prix}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.gallery} aria-labelledby="galerie-title">
        <h2 id="galerie-title" className={styles.h2}>
          Quelques journées fleuries
        </h2>
        <Gallery />
      </section>

      <DevisForm />
    </div>
  );
}
