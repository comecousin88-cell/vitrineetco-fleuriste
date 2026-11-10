"use client";

import Cta from "@/components/Cta";
import OpenBadge from "@/components/OpenBadge";
import Photo from "@/components/Photo";
import { BOUTIQUE, HORAIRES, LIVRAISON, telHref } from "@/data/boutique";
import { formatTime, parisNow } from "@/lib/hours";
import { useNow } from "@/lib/useNow";
import styles from "./Infos.module.css";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
// La semaine du lundi au dimanche ; l'indice suit Date.getDay().
const WEEK = [1, 2, 3, 4, 5, 6, 0];

export default function Infos() {
  const now = useNow();
  // Le jour d'aujourd'hui est mis en évidence, à l'heure de Paris, une fois dans le navigateur.
  const today = now ? parisNow(now).day : -1;

  return (
    <section id="infos" className={styles.section} aria-labelledby="infos-title">
      <Photo
        src="/infos/boutique-facade.webp"
        file="boutique-facade.jpg"
        alt="La façade de la boutique, peinte en vert sauge, avec des seaux de fleurs sur le trottoir."
        sizes="(min-width: 760px) 50vw, 100vw"
        className={styles.photo}
      />

      <div className={styles.content}>
        <h2 id="infos-title" className={styles.title}>
          Passer à la boutique
        </h2>
        <address className={styles.address}>
          {BOUTIQUE.street}
          <br />
          {BOUTIQUE.city}
        </address>
        <OpenBadge className={styles.badge} />

        <div className={styles.actions}>
          <Cta href={BOUTIQUE.itineraire} variant="clair" external>
            Itinéraire
          </Cta>
          <Cta href={telHref(BOUTIQUE.phone)} variant="clair">
            {BOUTIQUE.phone}
          </Cta>
          <Cta href={BOUTIQUE.instagram} variant="clair" external>
            Instagram
          </Cta>
        </div>

        <table className={styles.hours}>
          <caption className="visually-hidden">Horaires d&apos;ouverture</caption>
          <tbody>
            {WEEK.map((day) => {
              const opening = HORAIRES[day];
              return (
                <tr key={day} className={day === today ? styles.today : undefined} aria-current={day === today ? "date" : undefined}>
                  <th scope="row">
                    {DAYS[day]}
                    {day === today && <span className={styles.todayLabel}>aujourd&apos;hui</span>}
                  </th>
                  <td>{opening ? `${formatTime(opening.from)} – ${formatTime(opening.to)}` : "Fermé"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className={styles.note}>
          Livraison du mardi au samedi, le jour même pour toute commande avant {formatTime(LIVRAISON.limiteJourMeme)}.
        </p>
      </div>
    </section>
  );
}
