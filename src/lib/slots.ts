// Les jours et créneaux où l'on peut recevoir ou retirer un bouquet, calculés à l'heure de Paris.
// Une date est notée "2026-11-10" : ces clés se comparent comme du texte.

import { HORAIRES, LIVRAISON } from "@/data/boutique";
import { COMMANDE, CRENEAUX_LIVRAISON, type Creneau } from "@/data/livraison";
import { formatTime, parisNow } from "@/lib/hours";

export type Mode = "retrait" | "livraison";
export type Slot = Creneau & { label: string; available: boolean };
export type Day = { key: string; top: string; bottom: string; long: string };

const toUtc = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const addDays = (key: string, days: number) => {
  const date = toUtc(key);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export const todayKey = (now: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const format = (key: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", ...options }).format(toUtc(key));

// "Mardi 10 novembre"
export const longDate = (key: string) => capitalize(format(key, { weekday: "long", day: "numeric", month: "long" }));

const minutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};

export const slotLabel = ({ from, to }: Creneau) => `${formatTime(from)} – ${formatTime(to)}`;

// Les créneaux d'un jour : en livraison, ceux de la tournée ; en retrait, la matinée et l'après-midi d'ouverture.
export function creneaux(key: string, mode: Mode): Creneau[] {
  const weekday = toUtc(key).getUTCDay();
  if (mode === "livraison") return (LIVRAISON.jours as readonly number[]).includes(weekday) ? CRENEAUX_LIVRAISON : [];
  const opening = HORAIRES[weekday];
  if (!opening) return [];
  if (opening.to <= "13:00") return [{ id: "matin", from: opening.from, to: opening.to }];
  return [
    { id: "matin", from: opening.from, to: "13:00" },
    { id: "apres-midi", from: "13:00", to: opening.to },
  ];
}

export function slotsFor(key: string, mode: Mode, now: Date): Slot[] {
  const today = todayKey(now);
  const current = minutes(parisNow(now).time);
  const sameDayOpen = current < minutes(LIVRAISON.limiteJourMeme);
  return creneaux(key, mode).map((creneau) => {
    let available = key > today;
    if (key === today) {
      available =
        mode === "livraison"
          ? sameDayOpen && minutes(creneau.from) >= current + COMMANDE.preparationMinutes
          : minutes(creneau.to) - COMMANDE.retraitMargeMinutes >= current + COMMANDE.preparationMinutes;
    }
    return { ...creneau, label: slotLabel(creneau), available };
  });
}

const hasSlot = (key: string, mode: Mode, now: Date) => slotsFor(key, mode, now).some((slot) => slot.available);

// Les prochains jours possibles : les jours sans créneau libre sont écartés.
export function upcomingDays(mode: Mode, now: Date): Day[] {
  const today = todayKey(now);
  const days: Day[] = [];
  for (let offset = 0; offset <= COMMANDE.maxJours && days.length < COMMANDE.joursProposes; offset++) {
    const key = addDays(today, offset);
    if (!hasSlot(key, mode, now)) continue;
    days.push({
      key,
      top: offset === 0 ? "Auj." : offset === 1 ? "Demain" : capitalize(format(key, { weekday: "short" })),
      bottom: format(key, { day: "numeric", month: "short" }),
      long: longDate(key),
    });
  }
  return days;
}
