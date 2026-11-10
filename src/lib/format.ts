// 9 devient "9 €", 19.5 devient "19,50 €". L'espace est insécable : le prix ne se coupe jamais.
export const formatPrice = (price: number) =>
  `${price.toLocaleString("fr-FR", { minimumFractionDigits: Number.isInteger(price) ? 0 : 2 })} €`;
