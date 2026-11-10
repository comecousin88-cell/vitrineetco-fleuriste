import { commanderHref } from "@/data/bouquets";

// L'action principale de chaque page, dans les barres fixes. Chaque page la donne elle-même : rendue dans la
// mise en page commune, la barre ne saurait pas, côté serveur, sur quelle page elle se trouve.
export type PageAction = "bouquet" | "deuil" | "devis" | "atelier";

type Target = { href: string; label: string; short: string; tone: "commande" | "sobre" };

export function orderTarget(action: PageAction = "bouquet"): Target {
  switch (action) {
    case "deuil":
      return { href: "#commande-deuil", label: "Commander une composition", short: "Commander", tone: "sobre" };
    case "devis":
      return { href: "#devis", label: "Demander un devis", short: "Devis", tone: "commande" };
    case "atelier":
      return { href: "#reserver-atelier", label: "Réserver un atelier", short: "Réserver", tone: "commande" };
    default:
      return { href: commanderHref(), label: "Commander un bouquet", short: "Commander", tone: "commande" };
  }
}
