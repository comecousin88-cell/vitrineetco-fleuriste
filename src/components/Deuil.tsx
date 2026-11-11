"use client";

import { useRef, useState } from "react";
import DeuilForm from "@/components/DeuilForm";
import Photo from "@/components/Photo";
import { BOUTIQUE, telHref } from "@/data/boutique";
import { COMPOSITIONS, compositionPhoto } from "@/data/deuil";
import { formatPrice } from "@/lib/format";
import { scrollToSection } from "@/lib/lenis";
import { useSlowFade } from "@/lib/useSlowFade";
import styles from "./Deuil.module.css";

// Une page sobre : pas de vidéo, pas de parallaxe, pas de couleur vive. Le téléphone d'abord,
// puis les compositions avec leur prix, puis la commande.
export default function Deuil() {
  const [composition, setComposition] = useState<string>("");
  const root = useRef<HTMLDivElement>(null);
  useSlowFade(root);

  const choose = (slug: string) => {
    setComposition(slug);
    scrollToSection("commande-deuil");
  };

  return (
    <div ref={root}>
      <section className={styles.intro} aria-labelledby="deuil-title">
        <div className={styles.introText} data-fade>
          <h1 id="deuil-title" className={styles.title}>
            Fleurs de deuil
          </h1>
          <p className={styles.lead}>
            Je m&apos;occupe de tout, de la composition jusqu&apos;à la livraison sur le lieu de la cérémonie. Si vous préférez en parler,
            appelez-moi.
          </p>
          <div className={styles.phoneBox}>
            <p className={styles.phoneLabel}>Me joindre directement</p>
            <a href={telHref(BOUTIQUE.phone)} className={styles.phone}>
              {BOUTIQUE.phone}
            </a>
            <p className={styles.phoneHours}>{BOUTIQUE.horairesCourts}</p>
          </div>
        </div>
        <div data-fade>
        <Photo
          src="/deuil/ouverture.webp"
          file="deuil-ouverture.jpg"
          alt="Quelques roses blanches et une branche d'olivier posées sur un linge de lin."
          sizes="(min-width: 760px) 55vw, 100vw"
          className={styles.introPhoto}
          priority
        />
        </div>
      </section>

      <section className={styles.compositions} aria-labelledby="compositions-title">
        <h2 id="compositions-title" className={styles.h2}>
          Les compositions
        </h2>
        <ul className={styles.grid}>
          {COMPOSITIONS.map(({ slug, nom, phrase, prix, alt }) => {
            const photo = compositionPhoto(slug);
            return (
              <li key={slug} className={styles.card} data-fade>
                <Photo src={photo.src} file={photo.file} alt={alt} ratio="4 / 5" sizes="(min-width: 1024px) 33vw, 50vw" className={styles.cardPhoto} />
                <div className={styles.cardHead}>
                  <h3 className={styles.cardName}>{nom}</h3>
                  <p className={styles.cardPrice}>{formatPrice(prix)}</p>
                </div>
                <p className={styles.cardText}>{phrase}</p>
                <button type="button" className={styles.choose} onClick={() => choose(slug)} aria-label={`Choisir : ${nom}, ${formatPrice(prix)}`}>
                  Choisir
                </button>
              </li>
            );
          })}
          <li className={styles.custom} data-fade>
            <p className={styles.customTitle}>Autre chose en tête ?</p>
            <p className={styles.cardText}>Une fleur qu&apos;il ou elle aimait, une couleur, un budget : je compose sur mesure.</p>
            <a href={telHref(BOUTIQUE.phone)} className={styles.customPhone}>
              {BOUTIQUE.phone}
            </a>
          </li>
        </ul>
      </section>

      <DeuilForm composition={composition} onCompositionChange={setComposition} />
    </div>
  );
}
