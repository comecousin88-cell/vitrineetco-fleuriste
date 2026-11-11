"use client";

import { useRef, useState } from "react";
import AtelierForm from "@/components/AtelierForm";
import Photo from "@/components/Photo";
import { ATELIERS, SESSIONS, THEMES, type Session } from "@/data/ateliers";
import { BOUTIQUE, telHref } from "@/data/boutique";
import { formatPrice } from "@/lib/format";
import { placesLabel, shortDate } from "@/lib/ateliers";
import { formatTime } from "@/lib/hours";
import { scrollToSection } from "@/lib/lenis";
import { todayKey } from "@/lib/slots";
import { useBloomReveal } from "@/lib/useBloomReveal";
import { useNow } from "@/lib/useNow";
import styles from "./Ateliers.module.css";

const themeOf = (session: Session) => THEMES.find(({ slug }) => slug === session.theme)!;

export default function Ateliers() {
  const now = useNow();
  const root = useRef<HTMLDivElement>(null);
  useBloomReveal(root);
  // Les places restantes vivent ici : une réservation (simulée) les fait baisser à l'écran.
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [chosen, setChosen] = useState<string>("");

  const today = now ? todayKey(now) : "";
  const upcoming = sessions.filter(({ date }) => !today || date > today);

  const reserve = (id: string) => {
    setChosen(id);
    scrollToSection("reserver-atelier");
  };

  const onBooked = (id: string, places: number) =>
    setSessions((current) => current.map((session) => (session.id === id ? { ...session, restantes: session.restantes - places } : session)));

  return (
    <div ref={root}>
      <section className={styles.intro} aria-labelledby="ateliers-title">
        <div className={styles.introText}>
          <h1 id="ateliers-title" className={styles.title}>
            Ateliers floraux
          </h1>
          <p className={styles.lead}>
            Deux heures autour de ma grande table, des fleurs de saison et un café. Vous repartez avec ce que vous avez composé, même sans
            jamais avoir tenu un sécateur.
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Durée</dt>
              <dd>{ATELIERS.duree}</dd>
            </div>
            <div>
              <dt>Groupe</dt>
              <dd>{ATELIERS.maxPersonnes} personnes au plus</dd>
            </div>
            <div>
              <dt>Matériel</dt>
              <dd>Tout est fourni</dd>
            </div>
          </dl>
        </div>
        <div data-bloom className={styles.bloomFrame}>
        <Photo
          src="/ateliers/ateliers-ouverture.webp"
          file="ateliers-ouverture.jpg"
          alt="La grande table d'atelier : des participants composent leurs bouquets, des seaux de fleurs au premier plan."
          sizes="(min-width: 760px) 55vw, 100vw"
          className={styles.introPhoto}
          priority
        />
        </div>
      </section>

      <section className={styles.dates} aria-labelledby="dates-title">
        <h2 id="dates-title" className={styles.h2}>
          Prochaines dates
        </h2>
        <ul className={styles.sessions}>
          {upcoming.map((session) => {
            const theme = themeOf(session);
            const full = session.restantes === 0;
            return (
              <li key={session.id} className={`${styles.session} ${full ? styles.full : ""}`}>
                <p className={styles.date}>{shortDate(session.date)}</p>
                <div className={styles.what}>
                  <p className={styles.theme}>{theme.nom}</p>
                  <p className={styles.time}>
                    {formatTime(session.debut)} – {formatTime(session.fin)}
                  </p>
                </div>
                <p className={styles.price}>{formatPrice(theme.prix)}</p>
                <div className={styles.places}>
                  <span className={styles.dots} aria-hidden="true">
                    {Array.from({ length: session.places }, (_, index) => (
                      <span key={index} className={index < session.restantes ? styles.dotFree : styles.dot} />
                    ))}
                  </span>
                  <span className={styles.placesText}>{placesLabel(session.restantes)}</span>
                </div>
                <button
                  type="button"
                  className={styles.reserve}
                  disabled={full}
                  onClick={() => reserve(session.id)}
                  aria-label={full ? `${theme.nom}, ${shortDate(session.date)} : complet` : `Réserver : ${theme.nom}, ${shortDate(session.date)}`}
                >
                  {full ? "Complet" : "Réserver"}
                </button>
              </li>
            );
          })}
        </ul>
        <p className={styles.private}>
          Un atelier rien que pour vous, pour un anniversaire ou une équipe ? Appelez-moi au{" "}
          <a href={telHref(BOUTIQUE.phone)} className={styles.phone}>
            {BOUTIQUE.phone}
          </a>
          .
        </p>
      </section>

      <section className={styles.themes} aria-labelledby="themes-title">
        <h2 id="themes-title" className={styles.h2}>
          Les thèmes de la saison
        </h2>
        <ul className={styles.themeGrid}>
          {THEMES.map((theme) => (
            <li key={theme.slug} className={styles.themeCard}>
              <div data-bloom className={styles.bloomFrame}>
              <Photo
                src={`/ateliers/${theme.photo}.webp`}
                file={`${theme.photo}.jpg`}
                alt={`Atelier ${theme.nom.toLowerCase()}.`}
                ratio="4 / 5"
                sizes="(min-width: 1024px) 25vw, 50vw"
                className={styles.themePhoto}
              />
              </div>
              <div className={styles.themeHead}>
                <h3 className={styles.themeName}>{theme.nom}</h3>
                <p className={styles.themePrice}>{formatPrice(theme.prix)}</p>
              </div>
              <p className={styles.themeText}>{theme.phrase}</p>
            </li>
          ))}
        </ul>
      </section>

      <AtelierForm sessions={upcoming} chosen={chosen} onChoose={setChosen} onBooked={onBooked} />
    </div>
  );
}
