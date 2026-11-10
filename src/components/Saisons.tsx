"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Photo from "@/components/Photo";
import { currentSeasonIndex, SAISONS, saisonPhoto } from "@/data/saisons";
import { createFramePlayer } from "@/lib/frames";
import { scrollToY } from "@/lib/lenis";
import { useNow } from "@/lib/useNow";
import styles from "./Saisons.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LAST = SAISONS.length - 1;
// La fleur d'une saison s'ouvre pendant que son panneau arrive : sur cette part du trajet entre deux saisons.
const BLOOM_SPAN = 0.85;

export default function Saisons() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const now = useNow();
  const current = now ? currentSeasonIndex(now) : -1;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const blooms = q<HTMLElement>("[data-s=bloom]");

      // Une séquence par saison si elle est prête. Sinon, l'emplacement provisoire montre l'ouverture
      // par une jauge.
      const players = SAISONS.map(({ eclosion }, index) => {
        const canvas = blooms[index]?.querySelector("canvas");
        return canvas && eclosion.count > 0 ? createFramePlayer(canvas, eclosion.folder, eclosion.count, { autoStart: false }) : null;
      });
      const setBloom = (index: number, progress: number) => {
        const p = gsap.utils.clamp(0, 1, progress);
        blooms[index]?.style.setProperty("--p", String(p));
        const { count } = SAISONS[index].eclosion;
        players[index]?.draw(p * (count - 1));
      };

      // Les images ne se chargent qu'à l'approche de la section.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 250%",
        once: true,
        onEnter: () => players.forEach((player) => player?.start()),
      });

      const mm = gsap.matchMedia();

      // Moins d'animations : les saisons s'empilent, chaque fleur montrée ouverte.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        SAISONS.forEach((_, index) => setBloom(index, 1));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const [track] = q<HTMLElement>("[data-s=track]");
        // Chaque panneau fait la largeur visible de la page, sans la barre de défilement.
        const measure = () => track.style.setProperty("--panel-w", `${document.documentElement.clientWidth}px`);
        measure();
        ScrollTrigger.addEventListener("refreshInit", measure);
        const distance = () => track.scrollWidth - document.documentElement.clientWidth;

        // La première fleur s'ouvre pendant que la section monte à l'écran.
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => setBloom(0, self.progress),
          },
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const position = self.progress * LAST;
              setActive(Math.round(position));
              for (let index = 1; index <= LAST; index++) setBloom(index, (position - (index - BLOOM_SPAN)) / BLOOM_SPAN);
            },
          },
        });
        trigger.current = tl.scrollTrigger ?? null;

        tl.to(track, { x: () => -distance(), duration: LAST }, 0);
        // Le fond passe d'une saison à l'autre en même temps que les panneaux glissent.
        SAISONS.slice(1).forEach(({ fond }, index) => {
          tl.to(root.current, { backgroundColor: fond, duration: 1 }, index);
        });

        return () => {
          trigger.current = null;
          ScrollTrigger.removeEventListener("refreshInit", measure);
          track.style.removeProperty("--panel-w");
        };
      });

      return () => players.forEach((player) => player?.destroy());
    },
    { scope: root },
  );

  // Les onglets mènent à la saison : la position de défilement qui la centre.
  const goTo = (index: number) => {
    const st = trigger.current;
    if (st) {
      scrollToY(st.start + ((st.end - st.start) * index) / LAST);
      return;
    }
    document.getElementById(`saison-${SAISONS[index].slug}`)?.scrollIntoView({ block: "start" });
  };

  return (
    <section id="saisons" ref={root} className={styles.section} style={{ backgroundColor: SAISONS[0].fond }} aria-labelledby="saisons-title">
      <div className={styles.head}>
        <h2 id="saisons-title" className={styles.title}>
          Je suis le calendrier des champs
        </h2>
        <nav aria-label="Les saisons">
          <ol className={styles.tabs}>
            {SAISONS.map((saison, index) => (
              <li key={saison.slug}>
                <button
                  type="button"
                  className={styles.tab}
                  aria-current={active === index ? "true" : undefined}
                  onClick={() => goTo(index)}
                >
                  {saison.nom}
                  {current === index && <span className={styles.now}>en ce moment</span>}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track} data-s="track">
          {SAISONS.map((saison) => {
            const photo = saisonPhoto(saison.slug);
            return (
              <article
                key={saison.slug}
                id={`saison-${saison.slug}`}
                className={styles.panel}
                style={{ ["--fond" as string]: saison.fond }}
                aria-labelledby={`saison-${saison.slug}-nom`}
              >
                <div className={styles.text}>
                  <h3 id={`saison-${saison.slug}-nom`} className={styles.name}>
                    {saison.nom}
                  </h3>
                  <p className={styles.flowers}>{saison.fleurs}</p>
                  <p className={styles.phrase}>{saison.phrase}</p>
                </div>
                <div className={styles.media}>
                  <Photo src={photo.src} file={photo.file} alt={saison.alt} sizes="(min-width: 760px) 40vw, 70vw" className={styles.photo} />
                  <div className={styles.bloom} data-s="bloom">
                    {saison.eclosion.count > 0 ? (
                      <canvas className={styles.canvas} role="img" aria-label={`Une ${saison.eclosion.fleur} qui s'ouvre.`} />
                    ) : (
                      <div className={styles.bloomPlaceholder} aria-hidden="true">
                        <span>{saison.eclosion.file}</span>
                        <span className={styles.bloomBar} />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
