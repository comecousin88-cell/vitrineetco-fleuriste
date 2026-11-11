"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BouquetCard from "@/components/BouquetCard";
import { BOUTIQUE, telHref } from "@/data/boutique";
import { BOUQUETS } from "@/data/bouquets";
import { BUDGETS, COULEURS, filterLabel, matches, NO_FILTERS, OCCASIONS, sizesInBudget, type Filters } from "@/lib/catalogue";
import styles from "./Selection.module.css";

export default function Selection() {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const shown = BOUQUETS.filter((bouquet) => matches(bouquet, filters));
  const active = (Object.keys(filters) as (keyof Filters)[]).filter((key) => filters[key]);

  // Un second appui sur le même filtre le retire.
  const toggle = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((current) => ({ ...current, [key]: current[key] === value ? null : value }));

  return (
    <section id="selection" className={styles.section} aria-labelledby="selection-title">
      <div className={styles.head}>
        <h2 id="selection-title" className={styles.title}>
          Ce que j&apos;ai composé ce matin
        </h2>
        <p className={styles.lead}>Chaque bouquet existe en trois tailles. Les fleurs suivent les arrivages, l&apos;esprit reste le même.</p>
      </div>

      <div className={styles.filters}>
        <fieldset className={styles.group}>
          <legend>Occasion</legend>
          <div className={styles.chips}>
            {OCCASIONS.map(({ id, label }) => (
              <button key={id} type="button" className={styles.chip} aria-pressed={filters.occasion === id} onClick={() => toggle("occasion", id)}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>Budget</legend>
          <div className={styles.chips}>
            {BUDGETS.map(({ id, label }) => (
              <button key={id} type="button" className={styles.chip} aria-pressed={filters.budget === id} onClick={() => toggle("budget", id)}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>Couleur</legend>
          <div className={styles.chips}>
            {COULEURS.map(({ id, label, swatch }) => (
              <button key={id} type="button" className={styles.chip} aria-pressed={filters.couleur === id} onClick={() => toggle("couleur", id)}>
                <span className={styles.swatch} style={{ background: swatch }} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.status}>
        <p aria-live="polite">
          {shown.length === BOUQUETS.length ? `${BOUQUETS.length} bouquets` : `${shown.length} sur ${BOUQUETS.length} bouquets`}
        </p>
        {active.length > 0 && (
          <button type="button" className={styles.reset} onClick={() => setFilters(NO_FILTERS)}>
            Tout afficher
          </button>
        )}
      </div>

      <ul className={styles.grid}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((bouquet) => (
            <BouquetCard
              key={bouquet.slug}
              bouquet={bouquet}
              allowed={sizesInBudget(bouquet, filters.budget)}
            />
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence initial={false}>
        {shown.length === 0 && (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.emptyTitle}>Aucun bouquet ne réunit ces choix pour l&apos;instant.</p>
            <p>
              Retirez un filtre, ou appelez-moi au{" "}
              <a href={telHref(BOUTIQUE.phone)} className={styles.emptyPhone}>
                {BOUTIQUE.phone}
              </a>{" "}
              : je compose sur mesure.
            </p>
            <div className={styles.emptyActions}>
              {active.map((key) => (
                <button key={key} type="button" className={styles.chip} onClick={() => setFilters((current) => ({ ...current, [key]: null }))}>
                  Retirer « {filterLabel(key, filters[key]!)} »
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
