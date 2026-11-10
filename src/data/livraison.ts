// Les quartiers livrés et leurs tarifs, et les créneaux proposés. Les heures sont au format "10:00".

export type Quartier = { id: string; nom: string; codePostal: string; tarif: number };

export const QUARTIERS: Quartier[] = [
  { id: "paris-12", nom: "Paris 12e", codePostal: "75012", tarif: 8 },
  { id: "paris-11", nom: "Paris 11e", codePostal: "75011", tarif: 10 },
  { id: "paris-20", nom: "Paris 20e", codePostal: "75020", tarif: 10 },
  { id: "saint-mande", nom: "Saint-Mandé", codePostal: "94160", tarif: 10 },
  { id: "vincennes", nom: "Vincennes", codePostal: "94300", tarif: 12 },
];

export type Creneau = { id: string; from: string; to: string };

// En livraison, trois créneaux. Je pars en tournée avec les bouquets du créneau.
export const CRENEAUX_LIVRAISON: Creneau[] = [
  { id: "matin", from: "10:00", to: "13:00" },
  { id: "apres-midi", from: "14:00", to: "17:00" },
  { id: "fin-de-journee", from: "17:00", to: "19:30" },
];

export const COMMANDE = {
  // Le temps de composer le bouquet : un créneau commence au moins une heure après la commande.
  preparationMinutes: 60,
  // En retrait, le bouquet doit être prêt au moins 45 minutes avant la fin du créneau.
  retraitMargeMinutes: 45,
  joursProposes: 6,
  maxJours: 21,
  carteMax: 250,
} as const;
