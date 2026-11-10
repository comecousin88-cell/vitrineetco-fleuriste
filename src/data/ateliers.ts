// Les ateliers : les thèmes de la saison et les prochaines dates. Les dates passées disparaissent d'elles-mêmes.
// Photos : voir docs/medias.md, section Ateliers floraux.

export type Theme = { slug: string; nom: string; phrase: string; prix: number; photo: string };

export const THEMES: Theme[] = [
  {
    slug: "couronne",
    nom: "Couronne de l'Avent",
    phrase: "Sapin, eucalyptus et pommes de pin, montés sur une base de mousse.",
    prix: 65,
    photo: "atelier-couronne",
  },
  {
    slug: "centre-de-table",
    nom: "Centre de table de fête",
    phrase: "Une composition basse dans une coupe en terre cuite, pour la table des fêtes.",
    prix: 55,
    photo: "atelier-centre-de-table",
  },
  {
    slug: "champetre",
    nom: "Bouquet champêtre",
    phrase: "La technique du bouquet noué main, avec les fleurs de la semaine.",
    prix: 50,
    photo: "atelier-champetre",
  },
  {
    slug: "sec",
    nom: "Fleurs séchées",
    phrase: "Un bouquet qui dure tout l'hiver, avec des fleurs et des graminées séchées.",
    prix: 55,
    photo: "atelier-sec",
  },
];

export type Session = {
  id: string;
  theme: string; // le slug du thème
  date: string; // "2026-11-28"
  debut: string; // "10:00"
  fin: string;
  places: number;
  restantes: number;
};

export const SESSIONS: Session[] = [
  { id: "2026-11-28-couronne", theme: "couronne", date: "2026-11-28", debut: "10:00", fin: "12:00", places: 8, restantes: 3 },
  { id: "2026-12-02-couronne", theme: "couronne", date: "2026-12-02", debut: "18:30", fin: "20:30", places: 8, restantes: 0 },
  { id: "2026-12-05-couronne", theme: "couronne", date: "2026-12-05", debut: "10:00", fin: "12:00", places: 8, restantes: 6 },
  { id: "2026-12-12-centre", theme: "centre-de-table", date: "2026-12-12", debut: "14:00", fin: "16:00", places: 8, restantes: 5 },
  { id: "2026-12-19-centre", theme: "centre-de-table", date: "2026-12-19", debut: "10:00", fin: "12:00", places: 8, restantes: 1 },
  { id: "2027-01-16-champetre", theme: "champetre", date: "2027-01-16", debut: "10:00", fin: "12:00", places: 8, restantes: 8 },
  { id: "2027-01-30-sec", theme: "sec", date: "2027-01-30", debut: "14:00", fin: "16:00", places: 8, restantes: 7 },
];

export const ATELIERS = {
  duree: "2 heures",
  maxPersonnes: 8,
  maxParReservation: 4, // au-delà, c'est un atelier privé
} as const;
