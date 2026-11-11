// Le point de branchement des commandes. Le formulaire ne connaît que submitOrder.
//
// Pour une vraie boutique, il suffit d'écrire un autre OrderGateway et de l'assigner à « gateway » ci-dessous,
// sans toucher au formulaire. Par exemple :
// - paiement en ligne : une route Next (app/api/commande/route.ts) qui crée une session Stripe Checkout ou
//   SumUp avec le total, et renvoie l'adresse de paiement vers laquelle rediriger ;
// - commande payée en boutique : la même route envoie un e-mail à la fleuriste et au client (Resend, Brevo)
//   ou ajoute une ligne à un Google Sheet ;
// - boutique en ligne existante : la route crée la commande dans Shopify ou WooCommerce.
// Les montants sont toujours recalculés côté serveur à partir des tarifs : ceux du navigateur ne font pas foi.

import type { Taille } from "@/data/bouquets";
import type { Mode } from "@/lib/slots";

export type OrderRequest = {
  items: { slug: string; taille: Taille; qty: number }[]; // les bouquets du panier, livrés ensemble
  mode: Mode;
  livraison?: {
    quartier: string; // l'identifiant, "paris-12"
    adresse: string;
    complement: string;
    destinataire: string;
    telephoneDestinataire: string;
  };
  date: string; // "2026-11-10"
  creneau: string; // l'identifiant, "apres-midi"
  carte: string;
  client: { nom: string; telephone: string; email: string };
  total: number; // affiché au client, à recalculer côté serveur
};

export type OrderResult =
  | { ok: true; reference: string; simulated: boolean; redirectUrl?: string }
  | { ok: false; message: string };

// Une commande de deuil : livrée sur le lieu de la cérémonie, à une date et une heure précises.
export type FuneralOrderRequest = {
  composition: string; // le slug, "gerbe"
  lieu: {
    type: string; // "funerarium", "eglise"…
    nom: string;
    adresse: string;
    commune: string; // l'identifiant du quartier, ou "autre"
  };
  ceremonie: { date: string; heure: string }; // "2026-11-12", "10:30"
  defunt: string;
  ruban: string;
  carte: string;
  client: { nom: string; telephone: string; email: string };
  total: number;
};

export interface OrderGateway {
  submit(request: OrderRequest): Promise<OrderResult>;
  submitFuneral(request: FuneralOrderRequest): Promise<OrderResult>;
}

// Site concept : rien n'est envoyé, enregistré ni payé. Seul un court délai imite un vrai envoi.
const simulate = async (prefix: string, date: string): Promise<OrderResult> => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const [, month, day] = date.split("-");
  return { ok: true, reference: `${prefix}-${day}${month}-${String(Math.floor(Math.random() * 900) + 100)}`, simulated: true };
};

const simulatedGateway: OrderGateway = {
  submit: (request) => simulate("FDC", request.date),
  submitFuneral: (request) => simulate("FDC-D", request.ceremonie.date),
};

const gateway: OrderGateway = simulatedGateway;

export const submitOrder = (request: OrderRequest) => gateway.submit(request);
export const submitFuneralOrder = (request: FuneralOrderRequest) => gateway.submitFuneral(request);
