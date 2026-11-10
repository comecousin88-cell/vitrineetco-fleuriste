"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Photo from "@/components/Photo";
import { GALERIE } from "@/data/mariages";
import { EASE_OUT } from "@/lib/motion";
import styles from "./Gallery.module.css";

// Une mosaïque de formats mélangés ; un clic ouvre la photo en grand. La visionneuse est un vrai <dialog> :
// le focus y reste, Échap la ferme, les flèches passent d'une photo à l'autre.
export default function Gallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const show = (index: number, button: HTMLButtonElement) => {
    opener.current = button;
    setOpen(index);
    dialog.current?.showModal();
  };

  const close = useCallback(() => {
    dialog.current?.close();
  }, []);

  const step = useCallback((delta: number) => {
    setOpen((current) => (current === null ? current : (current + delta + GALERIE.length) % GALERIE.length));
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    // Le navigateur rend d'abord le focus de lui-même : on le replace ensuite sur la photo qui a été ouverte.
    const onClose = () => {
      setOpen(null);
      window.setTimeout(() => opener.current?.focus(), 0);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    element.addEventListener("close", onClose);
    element.addEventListener("keydown", onKey);
    return () => {
      element.removeEventListener("close", onClose);
      element.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = open === null ? null : GALERIE[open];

  return (
    <>
      <ul className={styles.grid}>
        {GALERIE.map((item, index) => (
          <li key={item.file} className={styles.item}>
            <button type="button" className={styles.open} onClick={(event) => show(index, event.currentTarget)} aria-label={`Agrandir : ${item.legende}`}>
              <Photo src={item.src} file={item.file} alt={item.alt} ratio={item.ratio} sizes="(min-width: 1024px) 33vw, 50vw" className={styles.photo} />
            </button>
            <p className={styles.caption}>{item.legende}</p>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label="Photo agrandie"
        onClick={(event) => {
          // Un clic sur le fond, autour de la photo, ferme la visionneuse.
          if (event.target === event.currentTarget) close();
        }}
      >
        {/* Pas d'animation de sortie : la photo suivante apparaît en fondu dès qu'on la demande. */}
        {current && (
          <motion.figure
            key={current.file}
            className={styles.figure}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <Photo src={current.src} file={current.file} alt={current.alt} ratio={current.ratio} sizes="90vw" className={styles.big} />
            <figcaption className={styles.bigCaption}>
              {current.legende}
              <span className={styles.count}>
                {open! + 1} / {GALERIE.length}
              </span>
            </figcaption>
          </motion.figure>
        )}
        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={() => step(-1)}>
            Précédente
          </button>
          <button type="button" className={styles.control} onClick={() => step(1)}>
            Suivante
          </button>
          <button type="button" className={`${styles.control} ${styles.close}`} onClick={close}>
            Fermer
          </button>
        </div>
      </dialog>
    </>
  );
}
