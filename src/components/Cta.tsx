"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./Cta.module.css";

type Props = {
  href: string;
  variant?: "commande" | "clair" | "sobre";
  size?: "petit" | "normal";
  className?: string;
  external?: boolean; // s'ouvre dans un nouvel onglet : un itinéraire, Instagram
  children: ReactNode;
};

// Les boutons du site. Terracotta pour commander, et seulement pour ça ; clair pour tout le reste.
// Sur la page Deuil, la commande passe en vert tige (« sobre ») : le terracotta y serait trop vif.
export default function Cta({ href, variant = "commande", size = "normal", className, external, children }: Props) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      className={`${styles.cta} ${styles[variant]} ${styles[size]} ${className ?? ""}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
    >
      {children}
    </motion.a>
  );
}
