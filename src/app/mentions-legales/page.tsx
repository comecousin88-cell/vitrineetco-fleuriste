import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { BOUTIQUE } from "@/data/boutique";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Mentions légales" };

// Les mentions de ce site de démonstration. Coordonnées de l'hébergeur reprises des démos du caviste et du
// bistrot (relevées sur vercel.com/legal, conditions du 19 octobre 2026). Pour un vrai client, ce contenu est à
// remplacer et à faire valider par un professionnel du droit.
export default function LegalPage() {
  return (
    <PageFrame>
      <div className={styles.legal}>
        <h1 className={styles.title}>Mentions légales</h1>

        <h2>Projet concept</h2>
        <p>
          Ce site est une démonstration. {BOUTIQUE.name} n&apos;existe pas : la boutique, la fleuriste, ses producteurs, ses bouquets,
          ses prix, son adresse et son téléphone sont inventés. Aucune commande, réservation, demande de devis ni abonnement n&apos;a lieu
          sur ce site.
        </p>

        <h2>Éditeur</h2>
        <p>
          Côme Cousin – Vitrine &amp; Co, particulier, également responsable de la publication.
          <br />
          Contact : <a href="mailto:vitrineetco@gmail.com">vitrineetco@gmail.com</a>
        </p>

        <h2>Hébergeur</h2>
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis
          <br />
          Contact :{" "}
          <a href="https://vercel.com/help" target="_blank" rel="noopener noreferrer">
            vercel.com/help
          </a>
        </p>

        <h2>Données personnelles</h2>
        <p>
          Les formulaires sont simulés : rien de ce que vous saisissez n&apos;est envoyé ni enregistré, et une photo d&apos;inspiration ne
          quitte pas votre appareil. Ce site ne dépose aucun cookie publicitaire.
        </p>
        <p>Les boutons « Itinéraire » et « Instagram » ouvrent Google Maps et Instagram, qui appliquent leurs propres règles.</p>

        <h2>Images</h2>
        <p>Les photos et vidéos du site ont été créées pour cette démonstration. Les personnes et les lieux représentés sont fictifs.</p>
      </div>
    </PageFrame>
  );
}
