// Le point de branchement des demandes qui ne sont pas des commandes : devis, réservations d'atelier,
// abonnements. Les formulaires ne connaissent que les fonctions exportées en bas.
//
// Pour une vraie boutique, une route Next (app/api/demande/route.ts) peut envoyer un e-mail à la fleuriste
// (Resend, Brevo), ajouter une ligne à un Google Sheet ou créer une fiche dans un CRM. La photo
// d'inspiration d'un devis partirait en pièce jointe, ou vers un stockage (Vercel Blob, S3).

export type QuoteRequest = {
  type: string; // "Mariage", "Entreprise"…
  date: string; // "2027-06-12"
  lieu: string;
  invites: number;
  budget: string;
  envies: string;
  photo: File | null;
  contact: { nom: string; telephone: string; email: string };
};

export type BookingRequest = {
  session: string; // l'identifiant de la séance, "2026-11-28-couronne"
  places: number;
  cadeau: { pour: string } | null; // une place offerte : le nom de la personne
  message: string;
  contact: { nom: string; telephone: string; email: string };
  total: number; // affiché au client, à recalculer côté serveur
};

export type SubscriptionRequest = {
  public: "particulier" | "entreprise";
  formule: string;
  rythme: string; // "hebdo", "quinzaine"
  jour: string; // "mardi", "vendredi"
  quartier: string;
  adresse: string;
  entreprise: string; // vide pour un particulier
  contact: { nom: string; telephone: string; email: string };
  prixLivraison: number | null; // null : sur devis
};

export type RequestResult = { ok: true; reference: string; simulated: boolean } | { ok: false; message: string };

export interface RequestGateway {
  quote(request: QuoteRequest): Promise<RequestResult>;
  // Une vraie réservation doit vérifier les places restantes côté serveur (Cal.com, un Google Sheet, une base).
  booking(request: BookingRequest): Promise<RequestResult>;
  // Un vrai abonnement passe par un paiement récurrent (Stripe Billing, GoCardless) ou une facture mensuelle.
  subscription(request: SubscriptionRequest): Promise<RequestResult>;
}

// Site concept : rien n'est envoyé ni enregistré, la photo ne quitte pas le navigateur.
const simulate = async (prefix: string): Promise<RequestResult> => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true, reference: `${prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}`, simulated: true };
};

const simulatedGateway: RequestGateway = {
  quote: () => simulate("DEV"),
  booking: () => simulate("ATL"),
  subscription: () => simulate("ABO"),
};

const gateway: RequestGateway = simulatedGateway;

export const submitQuote = (request: QuoteRequest) => gateway.quote(request);
export const submitBooking = (request: BookingRequest) => gateway.booking(request);
export const submitSubscription = (request: SubscriptionRequest) => gateway.subscription(request);
