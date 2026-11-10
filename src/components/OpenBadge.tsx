"use client";

import { shopStatus } from "@/lib/hours";
import { useNow } from "@/lib/useNow";
import styles from "./OpenBadge.module.css";

type Props = { withDetail?: boolean; className?: string };

// « Ouvert jusqu'à 19 h 30 » ou « Fermé, ouvre demain à 9 h », recalculé à chaque minute.
export default function OpenBadge({ withDetail = true, className }: Props) {
  const now = useNow();
  // Avant que le navigateur ne connaisse l'heure, une place réservée de la même taille, sans texte faux.
  if (!now) return <span className={`${styles.badge} ${styles.pending} ${className ?? ""}`} aria-hidden="true" />;

  const { open, label, detail } = shopStatus(now);
  return (
    <span className={`${styles.badge} ${open ? styles.open : styles.closed} ${className ?? ""}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      {withDetail && <span className={styles.detail}>{detail}</span>}
    </span>
  );
}
