// Tout ce qui décrit la boutique. Le lieu est fictif ; la série 01 99 00 est réservée à la fiction.

export const BOUTIQUE = {
  name: "La Fleur du Coin",
  fleuriste: "Louise",
  street: "9, rue des Lilas-Blancs",
  city: "75012 Paris",
  phone: "01 99 00 31 08",
  // La boutique est fictive : l'itinéraire mène au quartier, et le lien Instagram à l'accueil du réseau,
  // pour ne pas envoyer le visiteur vers une fausse adresse ou le compte de quelqu'un d'autre.
  itineraire: "https://www.google.com/maps/dir/?api=1&destination=Paris%2012e",
  instagram: "https://www.instagram.com/",
  // Les horaires en une phrase, pour les endroits où le tableau complet serait de trop.
  horairesCourts: "Du mardi au samedi de 9 h à 19 h 30, le dimanche de 9 h à 13 h.",
} as const;

// "01 99 00 31 08" devient "+33199003108", pour les liens tel:.
export const telHref = (phone: string) => `tel:+33${phone.replace(/\s/g, "").slice(1)}`;

// Les heures d'ouverture de chaque jour, au format "09:00". L'indice suit Date.getDay() : 0 pour dimanche.
export type Opening = { from: string; to: string } | null;

export const HORAIRES: Opening[] = [
  { from: "09:00", to: "13:00" }, // dimanche
  null, // lundi
  { from: "09:00", to: "19:30" }, // mardi
  { from: "09:00", to: "19:30" }, // mercredi
  { from: "09:00", to: "19:30" }, // jeudi
  { from: "09:00", to: "19:30" }, // vendredi
  { from: "09:00", to: "19:30" }, // samedi
];

export const LIVRAISON = {
  // Commandé avant cette heure un jour de livraison, livré le jour même.
  limiteJourMeme: "14:00",
  // Les jours où l'on livre : du mardi au samedi.
  jours: [2, 3, 4, 5, 6],
  premierCreneau: "10:00",
} as const;
