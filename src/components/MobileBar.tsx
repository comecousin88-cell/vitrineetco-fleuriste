"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BOUTIQUE, telHref } from "@/data/boutique";
import { orderTarget, type PageAction } from "@/lib/pageAction";
import styles from "./MobileBar.module.css";

// À portée de pouce sur téléphone : commander, appeler, venir. Elle ne s'efface que lorsque le clavier
// est ouvert sur un champ, pour ne pas le recouvrir.
export default function MobileBar({ action }: { action?: PageAction }) {
  const [typing, setTyping] = useState(false);
  const order = orderTarget(action);

  useEffect(() => {
    const isField = (target: EventTarget | null) =>
      target instanceof Element && target.matches("input:not([type=radio]):not([type=checkbox]), select, textarea");
    const onFocusIn = (event: FocusEvent) => setTyping(isField(event.target));
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <motion.nav
      className={styles.bar}
      aria-label="Actions rapides"
      initial={false}
      animate={{ y: typing ? "110%" : "0%" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      inert={typing}
    >
      <a href={order.href} className={`${styles.item} ${styles.order} ${order.tone === "sobre" ? styles.sobre : ""}`}>
        {order.short}
      </a>
      <a href={telHref(BOUTIQUE.phone)} className={styles.item}>
        Appeler
      </a>
      <a href={BOUTIQUE.itineraire} target="_blank" rel="noopener" className={styles.item}>
        Itinéraire
      </a>
    </motion.nav>
  );
}
