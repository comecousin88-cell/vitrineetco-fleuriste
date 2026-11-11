"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Cta from "@/components/Cta";
import OpenBadge from "@/components/OpenBadge";
import Photo from "@/components/Photo";
import { BOUTIQUE } from "@/data/boutique";
import { BOUQUET_SIGNATURE, commanderHref } from "@/data/bouquets";
import { HERO_FRAMES, HERO_POSTER } from "@/data/media";
import { createFramePlayer } from "@/lib/frames";
import { formatPrice } from "@/lib/format";
import { deliveryLine } from "@/lib/hours";
import { HERO_SCROLL } from "@/lib/motion";
import { useNow } from "@/lib/useNow";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// La partition du hero, sur une échelle de 0 à 10.
const FRAMES_END = 8.6; // le ruban est noué, le bouquet est fini
const OPEN_START = 0.6; // la fenêtre commence à s'agrandir
const OPEN_END = 7.6; // elle remplit l'écran au moment du nœud
const VEIL_START = 4.5; // le voile de lumière monte derrière le texte, qui reste lisible sur la vidéo
const FINALE_START = 8.6; // le bouquet fini se présente

const hasFrames = HERO_FRAMES.count > 0;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const now = useNow();
  const signature = BOUQUET_SIGNATURE;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Le repère du CSS suit la préférence, si le visiteur la change pendant sa visite.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        delete document.documentElement.dataset.anim;
      });

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 760px)",
        },
        (context) => {
          const { animate, wide } = context.conditions as { animate: boolean; wide: boolean };
          if (!animate) return;
          document.documentElement.dataset.anim = "1";

          // La fenêtre de départ, en pixels : à droite du texte sur ordinateur, entre le texte du haut et celui
          // du bas sur téléphone. Mesurée sur la page, et recalculée si l'écran change de taille.
          const startWindow = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const gutter = Math.min(Math.max(16, vw * 0.04), 56);
            const header = document.querySelector("header")?.offsetHeight ?? 0;
            if (wide) return { top: header + vh * 0.05, right: gutter, bottom: vh * 0.07, left: vw * 0.52 };
            const [upper] = q<HTMLElement>("[data-h=upper]");
            const [lower] = q<HTMLElement>("[data-h=lower]");
            const top = upper.offsetTop + upper.offsetHeight + 20;
            const bottom = vh - lower.offsetTop + 20;
            return { top, right: gutter, bottom: Math.min(bottom, vh - top - 160), left: gutter };
          };
          const clip = ({ top, right, bottom, left }: ReturnType<typeof startWindow>, radius: number) =>
            `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
          // La vidéo glisse pour que le bouquet reste au centre de la fenêtre, puis revient au centre de l'écran.
          const startShift = () => {
            const w = startWindow();
            return {
              x: (w.left + (window.innerWidth - w.right)) / 2 - window.innerWidth / 2,
              y: (w.top + (window.innerHeight - w.bottom)) / 2 - window.innerHeight / 2,
            };
          };

          let player: ReturnType<typeof createFramePlayer> | null = null;
          const video = { frame: 0 };
          const [canvas] = q<HTMLCanvasElement>("[data-h=sequence]");
          if (hasFrames && canvas) {
            const { count, folder, hdFromWidth } = HERO_FRAMES;
            // La série en 1920 px seulement si l'écran peut la montrer : elle pèse deux fois plus lourd.
            const series = !wide ? "portrait" : window.innerWidth * window.devicePixelRatio >= hdFromWidth ? "hd" : "landscape";
            player = createFramePlayer(canvas, `${folder}/${series}`, count);
          }
          const [progress] = q<HTMLElement>("[data-h=progress]");
          const lastFrame = Math.max(HERO_FRAMES.count - 1, 1);

          const tl = gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: `+=${HERO_SCROLL}`,
                pin: true,
                scrub: 0.4,
                invalidateOnRefresh: true,
              },
            })
            // La timeline couvre toujours toute l'échelle, pour que les instants ci-dessus restent justes.
            .to({}, { duration: 10 }, 0)
            .to(
              video,
              {
                frame: lastFrame,
                duration: FRAMES_END,
                onUpdate: () => {
                  player?.draw(video.frame);
                  // En attendant la vraie vidéo, l'emplacement provisoire montre où en est la composition.
                  if (progress) progress.style.setProperty("--p", String(video.frame / lastFrame));
                },
              },
              0,
            )
            .fromTo(
              q("[data-h=media]"),
              { clipPath: () => clip(startWindow(), 8) },
              { clipPath: () => clip({ top: 0, right: 0, bottom: 0, left: 0 }, 0), duration: OPEN_END - OPEN_START, ease: "power2.inOut" },
              OPEN_START,
            )
            .fromTo(
              q("[data-h=shift]"),
              { x: () => startShift().x, y: () => startShift().y },
              { x: 0, y: 0, duration: OPEN_END - OPEN_START, ease: "power2.inOut" },
              OPEN_START,
            )
            .fromTo(q("[data-h=veil]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: OPEN_END - VEIL_START }, VEIL_START)
            .fromTo(
              q("[data-h=finale]"),
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
              FINALE_START,
            );

          // Sur téléphone, le bouton du bas laisse la place au bouquet fini : un seul appel à commander à la fois.
          if (!wide) {
            tl.to(q("[data-h=lower]"), { autoAlpha: 0, y: 10, duration: 0.6 }, FINALE_START - 0.6);
          }

          return () => player?.destroy();
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="accueil" ref={root} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage} data-h="stage">
        <div className={styles.media} data-h="media">
          <div className={styles.shift} data-h="shift">
            {/* L'affiche : le bouquet fini. C'est elle qu'on voit sans animation ; avec, la séquence la recouvre. */}
            <Photo
              src={HERO_POSTER.src}
              file={HERO_POSTER.file}
              alt="Un bouquet de renoncules, de roses de jardin et d'eucalyptus, tenu d'une main au-dessus de la table."
              sizes="100vw"
              className={styles.poster}
              priority
            />
            {hasFrames ? (
              <canvas
                className={styles.canvas}
                data-h="sequence"
                role="img"
                aria-label="Des mains composent un bouquet tige par tige, puis nouent un ruban vert sauge."
              />
            ) : (
              <div className={styles.placeholder} data-h="progress" aria-hidden="true">
                <span className={styles.placeholderFile}>{HERO_FRAMES.source}</span>
                <span className={styles.placeholderText}>Des mains composent le bouquet tige par tige, puis nouent le ruban.</span>
                <span className={styles.placeholderBar} />
              </div>
            )}
          </div>
          <div className={styles.veil} data-h="veil" />
        </div>

        <div className={styles.upper} data-h="upper">
          <h1 id="hero-title" className={styles.title}>
            {BOUTIQUE.name}
          </h1>
          <p className={styles.lead}>
            Je compose chaque bouquet le matin même, avec des fleurs qui ont poussé à moins de cent kilomètres d&apos;ici.
          </p>
          <p className={styles.where}>
            <OpenBadge />
            <span className={styles.address}>{BOUTIQUE.street}, Paris 12e</span>
          </p>
        </div>

        <div className={styles.lower} data-h="lower">
          <p className={styles.delivery}>{now ? deliveryLine(now) : " "}</p>
          <Cta href={commanderHref()} className={styles.order}>
            Commander
          </Cta>
        </div>

        <div className={styles.finale} data-h="finale">
          <p className={styles.finaleName}>{signature.nom}</p>
          <p className={styles.finaleText}>Celui-ci, je le refais chaque matin.</p>
          <dl className={styles.prices}>
            {(["S", "M", "L"] as const).map((size) => (
              <div key={size}>
                <dt>{size}</dt>
                <dd>{formatPrice(signature.prix[size])}</dd>
              </div>
            ))}
          </dl>
          <Cta href={commanderHref(signature.slug)} className={styles.finaleCta}>
            Commander ce bouquet
          </Cta>
        </div>
      </div>
    </section>
  );
}
