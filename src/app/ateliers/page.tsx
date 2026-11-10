import type { Metadata } from "next";
import Ateliers from "@/components/Ateliers";
import PageFrame from "@/components/PageFrame";

export const metadata: Metadata = {
  title: "Ateliers floraux",
  description: "Ateliers de deux heures pour composer couronnes, bouquets et centres de table. Projet concept.",
};

export default function AteliersPage() {
  return (
    <PageFrame action="atelier">
      <Ateliers />
    </PageFrame>
  );
}
