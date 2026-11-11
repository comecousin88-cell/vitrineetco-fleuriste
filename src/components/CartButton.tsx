"use client";

import { motion } from "motion/react";
import { commanderHref } from "@/data/bouquets";
import { cartCount, useCart } from "@/lib/cart";
import styles from "./CartButton.module.css";

// L'icône du panier, dans la barre du haut. Elle mène à la commande et affiche le nombre de bouquets choisis.
export default function CartButton({ className }: { className?: string }) {
  const count = cartCount(useCart());
  const label = count === 0 ? "Panier vide" : `Panier, ${count} bouquet${count > 1 ? "s" : ""}`;

  return (
    <a href={commanderHref()} className={`${styles.cart} ${className ?? ""}`} aria-label={label} data-cart-target>
      {/* Un sac en papier, dessiné au trait : une icône d'interface, pas une illustration. */}
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className={styles.icon}>
        <path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 10V6.5a3 3 0 0 1 6 0V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {/* Le nombre se pose avec un petit rebond à chaque ajout : une nouvelle clé, une nouvelle entrée. */}
      {count > 0 && (
        <motion.span
          key={count}
          className={styles.count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 18 }}
        >
          {count}
        </motion.span>
      )}
    </a>
  );
}
