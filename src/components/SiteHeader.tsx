import CartButton from "@/components/CartButton";
import Cta from "@/components/Cta";
import OpenBadge from "@/components/OpenBadge";
import { BOUTIQUE, telHref } from "@/data/boutique";
import { orderTarget, type PageAction } from "@/lib/pageAction";
import styles from "./SiteHeader.module.css";

// Avec "/" devant : ces liens ramènent aussi à l'accueil depuis les autres pages.
const LINKS = [
  { href: "/#selection", label: "Bouquets" },
  { href: "/deuil", label: "Deuil" },
  { href: "/mariages-evenements", label: "Mariages" },
  { href: "/ateliers", label: "Ateliers" },
  { href: "/#abonnement", label: "Abonnement" },
  { href: "/#infos", label: "La boutique" },
];

// Toujours là, et discrète : commander, appeler, savoir si c'est ouvert.
export default function SiteHeader({ action }: { action?: PageAction }) {
  const order = orderTarget(action);
  return (
    <header className={styles.header}>
      <p className={styles.band}>Projet concept : boutique fictive, rien n&apos;est vendu ni livré.</p>
      <div className={styles.bar}>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/#accueil" className={styles.wordmark}>
          {BOUTIQUE.name}
        </a>
        <nav className={styles.nav} aria-label="Menu principal">
          <ul>
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <OpenBadge className={styles.badgeFull} />
          <OpenBadge withDetail={false} className={styles.badgeShort} />
          <a href={telHref(BOUTIQUE.phone)} className={styles.phone}>
            {BOUTIQUE.phone}
          </a>
          {/* Le panier des bouquets : pas sur la page Deuil, qui a sa propre commande. */}
          {action !== "deuil" && <CartButton />}
          <Cta href={order.href} size="petit" variant={order.tone} className={styles.order}>
            {order.label}
          </Cta>
        </div>
      </div>
    </header>
  );
}
