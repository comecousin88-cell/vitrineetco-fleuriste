"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Photo from "@/components/Photo";
import { GALERIE, type GalleryItem } from "@/data/mariages";
import { isReady, PHOTO_QUALITY } from "@/data/media";
import { lockScroll } from "@/lib/lenis";
import { useBloomReveal } from "@/lib/useBloomReveal";
import styles from "./Gallery.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Trois colonnes sur ordinateur, deux en dessous. Côté serveur, trois : le navigateur corrige aussitôt.
const wideQuery = "(min-width: 1024px)";
const subscribeWide = (listener: () => void) => {
  const media = window.matchMedia(wideQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
const useColumnCount = () => useSyncExternalStore(subscribeWide, () => (window.matchMedia(wideQuery).matches ? 3 : 2), () => 3);

// La vitesse de chaque colonne pendant le défilement, en pixels sur la traversée de la section.
const DRIFT = [-36, 44, -22];
const THUMB_SIZES = "(min-width: 1024px) 33vw, 50vw";

const ratioOf = ({ ratio }: GalleryItem) => {
  const [w, h] = ratio.split("/").map(Number);
  return w / h;
};

// Répartit les photos dans les colonnes, chacune dans la plus courte : la mosaïque reste équilibrée.
function split(items: GalleryItem[], columns: number) {
  const result: { item: GalleryItem; index: number }[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);
  items.forEach((item, index) => {
    const shortest = heights.indexOf(Math.min(...heights));
    result[shortest].push({ item, index });
    heights[shortest] += 1 / ratioOf(item);
  });
  return result;
}

export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const columns = useColumnCount();
  const [open, setOpen] = useState<number | null>(null);
  // Pendant la navigation dans la visionneuse, la photo change sans repartir de la mosaïque.
  const [browsing, setBrowsing] = useState(false);
  const [direction, setDirection] = useState(0);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useBloomReveal(root, { attribute: "data-bloom-galerie", dependencies: [columns] });

  // Parallaxe douce : chaque colonne glisse à sa vitesse pendant que la galerie traverse l'écran.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-column]", root.current).forEach((column, index) => {
          gsap.fromTo(
            column,
            { y: -DRIFT[index % DRIFT.length] },
            { y: DRIFT[index % DRIFT.length], ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
    },
    { scope: root, dependencies: [columns], revertOnUpdate: true },
  );

  const show = (index: number, button: HTMLButtonElement) => {
    opener.current = button;
    setBrowsing(false);
    setOpen(index);
  };

  const close = useCallback(() => {
    setBrowsing(false);
    setOpen(null);
  }, []);

  const step = useCallback((delta: number) => {
    setBrowsing(true);
    setDirection(delta);
    setOpen((current) => (current === null ? current : (current + delta + GALERIE.length) % GALERIE.length));
  }, []);

  // Visionneuse ouverte : la page ne défile plus, le clavier pilote, le focus reste dedans.
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    dialog.current?.querySelector<HTMLButtonElement>("[data-close]")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "Tab" && dialog.current) {
        const focusable = [...dialog.current.querySelectorAll<HTMLElement>("button")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const button = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      button?.focus({ preventScroll: true });
    };
  }, [isOpen, close, step]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) step(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) step(-1);
  };

  const current = open === null ? null : GALERIE[open];

  return (
    <>
      <div ref={root} className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {split(GALERIE, columns).map((column, columnIndex) => (
          <ul key={columnIndex} className={styles.column} data-column>
            {column.map(({ item, index }) => (
              <li key={item.file} className={styles.item} data-bloom-galerie>
                <button
                  type="button"
                  className={styles.open}
                  onClick={(event) => show(index, event.currentTarget)}
                  aria-label={`Agrandir : ${item.legende}`}
                >
                  <motion.div layoutId={`galerie-${item.file}`} className={styles.thumb} style={{ aspectRatio: item.ratio }}>
                    {isReady(item.src) ? (
                      <Image src={item.src} alt={item.alt} fill sizes={THUMB_SIZES} quality={PHOTO_QUALITY} className={styles.image} />
                    ) : (
                      <Photo src={item.src} file={item.file} alt={item.alt} ratio={item.ratio} sizes={THUMB_SIZES} />
                    )}
                  </motion.div>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            key="visionneuse"
            ref={dialog}
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${open! + 1} sur ${GALERIE.length} : ${current.legende}`}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => {
              // Toucher le fond, autour de la photo, ferme la visionneuse.
              if (event.target === event.currentTarget) close();
            }}
          >
            <motion.div
              key={current.file}
              layoutId={`galerie-${current.file}`}
              className={styles.big}
              style={{ aspectRatio: current.ratio, ["--r" as string]: ratioOf(current) }}
              // À l'ouverture et à la fermeture, la photo grandit depuis la mosaïque (ou y retourne). En navigation,
              // elle glisse simplement de côté.
              initial={browsing ? { x: direction * 60, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                layout: browsing ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 32 },
                default: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={onDragEnd}
            >
              {isReady(current.src) ? (
                <>
                  {/* La miniature, déjà chargée, tient la place pendant que la grande image arrive. */}
                  <Image src={current.src} alt="" fill sizes={THUMB_SIZES} quality={PHOTO_QUALITY} className={styles.image} draggable={false} />
                  <Image src={current.src} alt={current.alt} fill sizes="92vw" quality={PHOTO_QUALITY} className={styles.image} draggable={false} priority />
                </>
              ) : (
                <Photo src={current.src} file={current.file} alt={current.alt} ratio={current.ratio} sizes="92vw" />
              )}
            </motion.div>

            <div className={styles.controls}>
              <span className={styles.count} aria-hidden="true">
                {open! + 1} / {GALERIE.length}
              </span>
              <button type="button" className={styles.control} onClick={() => step(-1)} aria-label="Photo précédente">
                ←
              </button>
              <button type="button" className={styles.control} onClick={() => step(1)} aria-label="Photo suivante">
                →
              </button>
              <button type="button" className={`${styles.control} ${styles.close}`} onClick={close} data-close>
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
