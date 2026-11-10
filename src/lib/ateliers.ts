// Les libellés des séances d'atelier, partagés par la liste des dates et le formulaire.

// "Sam. 28 nov."
export const shortDate = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  const text = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(new Date(Date.UTC(year, month - 1, day)));
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const placesLabel = (restantes: number) => (restantes === 0 ? "Complet" : restantes === 1 ? "Dernière place" : `${restantes} places`);
