import { HORAIRES, LIVRAISON } from "@/data/boutique";

const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

// "09:00" devient "9 h", "19:30" devient "19 h 30". Les espaces sont insécables.
export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  return minutes === "00" ? `${Number(hours)} h` : `${Number(hours)} h ${minutes}`;
};

// L'heure de Paris, où que soit le visiteur.
export function parisNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(read("weekday"));
  return { day, time: `${read("hour")}:${read("minute")}` };
}

const dayLabel = (offset: number, day: number) => (offset === 1 ? "demain" : DAYS[day]);

function nextOpening(day: number) {
  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    const opening = HORAIRES[next];
    if (opening) return `${dayLabel(offset, next)} à ${formatTime(opening.from)}`;
  }
  return "bientôt";
}

export type Status = { open: boolean; label: string; detail: string };

// Le badge : ouvert ou fermé, et ce qui compte à cet instant.
export function shopStatus(now: Date): Status {
  const { day, time } = parisNow(now);
  const today = HORAIRES[day];
  if (today && today.from <= time && time < today.to) {
    return { open: true, label: "Ouvert", detail: `jusqu'à ${formatTime(today.to)}` };
  }
  if (today && time < today.from) {
    return { open: false, label: "Fermé", detail: `ouvre à ${formatTime(today.from)}` };
  }
  return { open: false, label: "Fermé", detail: `ouvre ${nextOpening(day)}` };
}

// La phrase de livraison, juste à l'instant où on la lit.
export function deliveryLine(now: Date) {
  const { day, time } = parisNow(now);
  const cutoff = LIVRAISON.limiteJourMeme;
  if ((LIVRAISON.jours as readonly number[]).includes(day) && time < cutoff) {
    return `Livraison aujourd'hui pour toute commande avant ${formatTime(cutoff)}`;
  }
  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    if ((LIVRAISON.jours as readonly number[]).includes(next)) {
      return `Commandez maintenant, livré ${dayLabel(offset, next)} dès ${formatTime(LIVRAISON.premierCreneau)}`;
    }
  }
  return "";
}
