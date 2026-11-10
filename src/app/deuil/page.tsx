import type { Metadata } from "next";
import Deuil from "@/components/Deuil";
import PageFrame from "@/components/PageFrame";

export const metadata: Metadata = {
  title: "Fleurs de deuil",
  description: "Compositions de deuil livrées au funérarium, au lieu de culte ou au cimetière. Projet concept.",
};

export default function DeuilPage() {
  return (
    <PageFrame action="deuil">
      <Deuil />
    </PageFrame>
  );
}
