import Abonnement from "@/components/Abonnement";
import Commander from "@/components/Commander";
import Fleuriste from "@/components/Fleuriste";
import Hero from "@/components/Hero";
import PageFrame from "@/components/PageFrame";
import Infos from "@/components/Infos";
import OrderLinks from "@/components/OrderLinks";
import Saisons from "@/components/Saisons";
import Selection from "@/components/Selection";
import Univers from "@/components/Univers";

export default function Home() {
  return (
    <PageFrame action="bouquet">
      <OrderLinks />
      <Hero />
      <Selection />
      <Univers />
      <Saisons />
      <Commander />
      <Abonnement />
      <Fleuriste />
      <Infos />
    </PageFrame>
  );
}
