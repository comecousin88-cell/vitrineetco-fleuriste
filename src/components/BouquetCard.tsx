"use client";

import { forwardRef, useState } from "react";
import { motion } from "motion/react";
import Photo from "@/components/Photo";
import type { Bouquet, Taille } from "@/data/bouquets";
import { bouquetPhoto } from "@/data/media";
import { formatPrice } from "@/lib/format";
import styles from "./BouquetCard.module.css";

type Props = {
  bouquet: Bouquet;
  allowed: Taille[]; // les tailles dans le budget choisi
  onOrder: (taille: Taille) => void;
};

const TAILLES: Taille[] = ["S", "M", "L"];

// Une carte : la photo, le nom, les trois prix (qui servent aussi à choisir la taille) et le bouton.
const BouquetCard = forwardRef<HTMLLIElement, Props>(function BouquetCard({ bouquet, allowed, onOrder }, ref) {
  const [choice, setChoice] = useState<Taille>("M");
  // Si un budget écarte la taille choisie, on montre la plus proche qui y entre.
  const taille = allowed.includes(choice) ? choice : (allowed.find((t) => TAILLES.indexOf(t) > TAILLES.indexOf(choice)) ?? allowed[allowed.length - 1]);
  const photo = bouquetPhoto(bouquet.slug);

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={styles.card}
    >
      <Photo
        src={photo.src}
        file={photo.file}
        alt={`Le bouquet ${bouquet.nom} : ${bouquet.fleurs.toLowerCase()}.`}
        ratio="4 / 5"
        sizes="(min-width: 1024px) 25vw, 50vw"
        className={styles.photo}
      />
      <h3 className={styles.name}>{bouquet.nom}</h3>
      <p className={styles.flowers}>{bouquet.fleurs}</p>

      <fieldset className={styles.sizes}>
        <legend className="visually-hidden">Taille du bouquet {bouquet.nom}</legend>
        {TAILLES.map((t) => {
          const disabled = !allowed.includes(t);
          return (
            <label key={t} className={`${styles.size} ${disabled ? styles.sizeOut : ""}`}>
              <input
                type="radio"
                name={`taille-${bouquet.slug}`}
                value={t}
                checked={taille === t}
                disabled={disabled}
                onChange={() => setChoice(t)}
              />
              <span className={styles.sizeLetter}>{t}</span>
              <span className={styles.sizePrice}>{formatPrice(bouquet.prix[t])}</span>
            </label>
          );
        })}
      </fieldset>

      <motion.button
        type="button"
        className={styles.order}
        onClick={() => onOrder(taille)}
        whileTap={{ scale: 0.97 }}
        aria-label={`Commander ${bouquet.nom}, taille ${taille}, ${formatPrice(bouquet.prix[taille])}`}
      >
        Commander en {taille}
      </motion.button>
    </motion.li>
  );
});

export default BouquetCard;
