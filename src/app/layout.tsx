import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Young_Serif } from "next/font/google";
import MotionRoot from "@/components/MotionRoot";
import SmoothScroll from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

// Young Serif : les titres, ronds comme une corolle. Hanken Grotesk : tout ce qui se lit, les prix, les formulaires.
const titre = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-titre" });
const texte = Hanken_Grotesk({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-texte" });

export const metadata: Metadata = {
  title: { default: "La Fleur du Coin (projet concept)", template: "%s, La Fleur du Coin" },
  description: "Site concept d'une fleuriste de quartier fictive, réalisé pour le portfolio Vitrine & Co.",
};

export const viewport: Viewport = {
  themeColor: "#f3f4ee",
};

// Lu avant le premier affichage : le hero animé démarre directement dans son état initial, sans saut.
// Sans JavaScript ou avec moins d'animations, ce repère est absent et le bouquet fini s'affiche tel quel.
const animCheck = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.anim="1"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : le script ci-dessus ajoute un attribut à <html> avant React.
    <html lang="fr" className={`${titre.variable} ${texte.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: animCheck }} />
      </head>
      <body>
        <MotionRoot>
          <SmoothScroll />
          {children}
        </MotionRoot>
      </body>
    </html>
  );
}
