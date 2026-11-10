import Link from "next/link";
import { BOUTIQUE, telHref } from "@/data/boutique";
import styles from "./SiteFooter.module.css";

const LINKS = [
  { href: "/#selection", label: "Bouquets" },
  { href: "/deuil", label: "Deuil" },
  { href: "/mariages-evenements", label: "Mariages & événements" },
  { href: "/ateliers", label: "Ateliers" },
  { href: "/#abonnement", label: "Abonnement" },
  { href: "/#infos", label: "La boutique" },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <p className={styles.name}>{BOUTIQUE.name}</p>
          <p className={styles.line}>
            {BOUTIQUE.street}, {BOUTIQUE.city}
            <br />
            <a href={telHref(BOUTIQUE.phone)}>{BOUTIQUE.phone}</a>
          </p>
        </div>
        <nav aria-label="Plan du site">
          <ul className={styles.links}>
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles.bottom}>
        <p>Projet concept : cette boutique, ses bouquets, ses prix et ses commandes sont fictifs.</p>
        <p className={styles.legal}>
          <Link href="/mentions-legales">Mentions légales</Link>
          <span>Site réalisé par Vitrine &amp; Co</span>
        </p>
      </div>
    </footer>
  );
}
