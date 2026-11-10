// Les quatre entrées de « Nos univers ». Les photos viendront de source/ (voir docs/proposition.md).

export type Univers = {
  slug: string;
  titre: string;
  phrase: string;
  href: string;
  alt: string;
};

export const UNIVERS: Univers[] = [
  {
    slug: "bouquets",
    titre: "Bouquets",
    phrase: "Pour un anniversaire, un merci, ou rien de particulier.",
    href: "/#selection",
    alt: "Le comptoir de la boutique, avec des bouquets emballés de kraft et de papier de soie rose.",
  },
  {
    slug: "deuil",
    titre: "Deuil",
    phrase: "Des compositions sobres, livrées au funérarium ou à l'église. Vous pouvez m'appeler directement.",
    href: "/deuil",
    alt: "Une gerbe de roses blanches posée sur un banc de pierre claire.",
  },
  {
    slug: "mariages",
    titre: "Mariages & événements",
    phrase: "De l'arche à la boutonnière, je fleuris votre journée sur devis.",
    href: "/mariages-evenements",
    alt: "Un bouquet de mariée blanc et vert tenu à deux mains devant une robe de lin.",
  },
  {
    slug: "ateliers",
    titre: "Ateliers",
    phrase: "Deux heures autour de ma table, et vous repartez avec votre bouquet.",
    href: "/ateliers",
    alt: "Des mains composent des petits bouquets autour d'une grande table d'atelier.",
  },
];

export const universPhoto = (slug: string) => ({
  src: `/univers/${slug}.webp`,
  file: `univers-${slug}.jpg`,
});
