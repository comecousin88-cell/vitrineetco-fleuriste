import type { Metadata } from "next";
import Mariages from "@/components/Mariages";
import PageFrame from "@/components/PageFrame";

export const metadata: Metadata = {
  title: "Mariages & événements",
  description: "Fleurs de mariage, de fête et d'événement d'entreprise, sur devis. Projet concept.",
};

export default function MariagesPage() {
  return (
    <PageFrame action="devis">
      <Mariages />
    </PageFrame>
  );
}
