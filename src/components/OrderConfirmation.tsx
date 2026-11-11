"use client";

import { motion } from "motion/react";
import type { Confirmed } from "@/components/Commander";
import { BOUTIQUE, telHref } from "@/data/boutique";
import { BOUQUETS } from "@/data/bouquets";
import { QUARTIERS } from "@/data/livraison";
import { formatPrice } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import { formatTime } from "@/lib/hours";
import { creneaux, longDate } from "@/lib/slots";
import styles from "./OrderConfirmation.module.css";

type Props = { confirmed: Confirmed; onRestart: () => void };

// La confirmation, à la place du formulaire : tout ce qui a été commandé, et la référence à donner au téléphone.
export default function OrderConfirmation({ confirmed: { reference, request }, onRestart }: Props) {
  const lines = request.items.map(({ slug, taille, qty }) => ({ nom: BOUQUETS.find((b) => b.slug === slug)?.nom ?? slug, taille, qty }));
  const count = request.items.reduce((sum, { qty }) => sum + qty, 0);
  // « Le Coin », ou « vos 3 bouquets » : la phrase suit le panier.
  const what = count === 1 ? lines[0].nom : `vos ${count} bouquets`;
  const quartier = QUARTIERS.find(({ id }) => id === request.livraison?.quartier);
  const prenom = request.client.nom.split(/\s+/)[0];
  const creneau = creneaux(request.date, request.mode).find(({ id }) => id === request.creneau);
  const quand = `${longDate(request.date).toLowerCase()}${creneau ? `, entre ${formatTime(creneau.from)} et ${formatTime(creneau.to)}` : ""}`;

  return (
    <motion.div
      className={styles.box}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      role="status"
    >
      <p className={styles.title}>Merci {prenom}, c&apos;est noté.</p>
      <p className={styles.text}>
        {request.mode === "livraison"
          ? `Je compose ${what} et je ${count === 1 ? "le" : "les"} livre ${quand}.`
          : `${count === 1 ? what : what.charAt(0).toUpperCase() + what.slice(1)} ${count === 1 ? "vous attend" : "vous attendent"} à la boutique ${quand}.`}
      </p>

      <dl className={styles.lines}>
        <div>
          <dt>Référence</dt>
          <dd className={styles.reference}>{reference}</dd>
        </div>
        <div>
          <dt>{count === 1 ? "Bouquet" : "Bouquets"}</dt>
          <dd>
            {lines.map(({ nom, taille, qty }) => (
              <span key={`${nom}-${taille}`} className={styles.item}>
                {qty > 1 ? `${qty} × ` : ""}
                {nom}, taille {taille}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>{request.mode === "livraison" ? "Livraison" : "Retrait"}</dt>
          <dd>
            {request.mode === "livraison" && request.livraison
              ? `${request.livraison.destinataire}, ${request.livraison.adresse}, ${quartier?.nom}`
              : `${BOUTIQUE.street}, ${BOUTIQUE.city}`}
          </dd>
        </div>
        {request.carte && (
          <div>
            <dt>Carte</dt>
            <dd className={styles.card}>{request.carte}</dd>
          </div>
        )}
        <div className={styles.totalLine}>
          <dt>Total</dt>
          <dd>{formatPrice(request.total)}</dd>
        </div>
      </dl>

      <p className={styles.note}>
        Projet concept : rien n&apos;a été envoyé ni payé. Dans la vraie boutique, la confirmation partirait à {request.client.email}, et
        vous pourriez m&apos;appeler au{" "}
        <a href={telHref(BOUTIQUE.phone)} className={styles.phone}>
          {BOUTIQUE.phone}
        </a>{" "}
        avec la référence.
      </p>
      <button type="button" className={styles.restart} onClick={onRestart}>
        Commander un autre bouquet
      </button>
    </motion.div>
  );
}
