import type { ReactNode } from "react";
import MobileBar from "@/components/MobileBar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { PageAction } from "@/lib/pageAction";

// Les barres fixes autour du contenu d'une page. Chaque page dit quelle est son action principale
// (commander un bouquet, une composition de deuil, demander un devis…) : elle s'affiche juste dès le serveur.
export default function PageFrame({ action, children }: { action?: PageAction; children: ReactNode }) {
  return (
    <>
      <SiteHeader action={action} />
      <main>{children}</main>
      <SiteFooter />
      <MobileBar action={action} />
    </>
  );
}
