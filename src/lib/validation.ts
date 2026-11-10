// Les contrôles des formulaires. Chaque message dit ce qu'il faut corriger.

export function requiredError(value: string, message: string) {
  return value.trim() ? null : message;
}

export function nameError(name: string) {
  return name.trim().length >= 2 ? null : "Indiquez votre nom, pour que je sache à qui est la commande.";
}

// Un numéro français, avec ou sans espaces, points ou tirets : 06 12 34 56 78, +33 6 12 34 56 78.
export function phoneError(phone: string, empty = "Indiquez un numéro pour que je puisse vous joindre.") {
  const digits = phone.replace(/[\s.\-()]/g, "");
  if (!digits) return empty;
  return /^(0[1-9]\d{8}|(\+33|0033)[1-9]\d{8})$/.test(digits) ? null : "Ce numéro doit compter 10 chiffres, par exemple 06 12 34 56 78.";
}

export function emailError(email: string) {
  const value = email.trim();
  if (!value) return "Indiquez un e-mail pour recevoir la confirmation.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : "Cet e-mail semble incomplet, par exemple camille@exemple.fr.";
}
