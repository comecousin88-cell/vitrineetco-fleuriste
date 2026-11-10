"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import OrderConfirmation from "@/components/OrderConfirmation";
import Photo from "@/components/Photo";
import { BOUTIQUE } from "@/data/boutique";
import { BOUQUETS, type Taille } from "@/data/bouquets";
import { COMMANDE, QUARTIERS } from "@/data/livraison";
import { bouquetPhoto } from "@/data/media";
import { formatPrice } from "@/lib/format";
import { deliveryLine } from "@/lib/hours";
import { EASE_OUT } from "@/lib/motion";
import { submitOrder, type OrderRequest } from "@/lib/order";
import { setDraft, setDraftSize, useDraft } from "@/lib/orderDraft";
import { slotsFor, upcomingDays, type Mode } from "@/lib/slots";
import { useNow } from "@/lib/useNow";
import { emailError, nameError, phoneError, requiredError } from "@/lib/validation";
import styles from "./Commander.module.css";

const TAILLES: Taille[] = ["S", "M", "L"];

type Fields = {
  quartier: string;
  adresse: string;
  complement: string;
  destinataire: string;
  telephoneDestinataire: string;
  carte: string;
  nom: string;
  telephone: string;
  email: string;
};

const EMPTY: Fields = {
  quartier: "",
  adresse: "",
  complement: "",
  destinataire: "",
  telephoneDestinataire: "",
  carte: "",
  nom: "",
  telephone: "",
  email: "",
};

type Errors = Partial<Record<keyof Fields | "bouquet" | "creneau", string>>;
// L'ordre des champs dans la page : le premier en erreur reçoit le focus.
const ORDER: (keyof Errors)[] = ["bouquet", "quartier", "adresse", "destinataire", "telephoneDestinataire", "creneau", "nom", "telephone", "email"];

export type Confirmed = { reference: string; request: OrderRequest };

export default function Commander() {
  const now = useNow();
  const draft = useDraft();
  const bouquet = draft ? BOUQUETS.find(({ slug }) => slug === draft.slug) : undefined;
  const taille = draft?.taille ?? "M";

  const [mode, setMode] = useState<Mode>("livraison");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [chosenDay, setChosenDay] = useState<string | null>(null);
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  // Le premier jour et le premier créneau libres sont choisis d'office : on peut commander sans y toucher.
  const days = now ? upcomingDays(mode, now) : [];
  const day = days.find(({ key }) => key === chosenDay) ?? days[0];
  const slots = day && now ? slotsFor(day.key, mode, now) : [];
  const slot = slots.find(({ id, available }) => id === chosenSlot && available) ?? slots.find(({ available }) => available);

  const quartier = QUARTIERS.find(({ id }) => id === fields.quartier);
  const fee = mode === "livraison" ? (quartier?.tarif ?? 0) : 0;
  const total = (bouquet ? bouquet.prix[taille] : 0) + fee;

  const set = (key: keyof Fields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate(): Errors {
    const found: Errors = {};
    if (!bouquet) found.bouquet = "Choisissez un bouquet.";
    if (mode === "livraison") {
      if (!quartier) found.quartier = "Choisissez le quartier de livraison.";
      found.adresse = requiredError(fields.adresse, "Indiquez l'adresse de livraison.") ?? undefined;
      found.destinataire = requiredError(fields.destinataire, "Indiquez le nom de la personne qui reçoit les fleurs.") ?? undefined;
      if (fields.telephoneDestinataire.trim()) found.telephoneDestinataire = phoneError(fields.telephoneDestinataire) ?? undefined;
    }
    if (!day || !slot) found.creneau = "Choisissez un jour et un créneau.";
    found.nom = nameError(fields.nom) ?? undefined;
    found.telephone = phoneError(fields.telephone) ?? undefined;
    found.email = emailError(fields.email) ?? undefined;
    return Object.fromEntries(Object.entries(found).filter(([, message]) => message)) as Errors;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    const first = ORDER.find((key) => found[key]);
    if (first) {
      document.getElementById(`commande-${first}`)?.focus();
      return;
    }
    if (!bouquet || !day || !slot) return;

    const request: OrderRequest = {
      bouquet: bouquet.slug,
      taille,
      mode,
      livraison:
        mode === "livraison"
          ? {
              quartier: fields.quartier,
              adresse: fields.adresse.trim(),
              complement: fields.complement.trim(),
              destinataire: fields.destinataire.trim(),
              telephoneDestinataire: fields.telephoneDestinataire.trim(),
            }
          : undefined,
      date: day.key,
      creneau: slot.id,
      carte: fields.carte.trim(),
      client: { nom: fields.nom.trim(), telephone: fields.telephone.trim(), email: fields.email.trim() },
      total,
    };

    setSending(true);
    const result = await submitOrder(request);
    setSending(false);
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    setConfirmed({ reference: result.reference, request });
    document.getElementById("commander")?.scrollIntoView({ block: "start" });
  }

  function reset() {
    setConfirmed(null);
    setFields(EMPTY);
    setChosenDay(null);
    setChosenSlot(null);
    setErrors({});
  }

  const errorId = (key: keyof Errors) => (errors[key] ? `commande-${key}-erreur` : undefined);
  // Un message d'erreur sous le champ. Un <span> et pas un <p> : il peut se trouver dans un <label>.
  const errorText = (name: keyof Errors) =>
    errors[name] ? (
      <span id={`commande-${name}-erreur`} className={styles.error}>
        {errors[name]}
      </span>
    ) : null;

  const photo = bouquet ? bouquetPhoto(bouquet.slug) : null;

  return (
    <section id="commander" className={styles.section} aria-labelledby="commander-title">
      <div className={styles.head}>
        <h2 id="commander-title" className={styles.title} tabIndex={-1}>
          Commander
        </h2>
        <p className={styles.lead}>{now ? `${deliveryLine(now)}.` : " "}</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {confirmed ? (
          <OrderConfirmation key="confirmation" confirmed={confirmed} onRestart={reset} />
        ) : (
          <motion.form
            key="formulaire"
            className={styles.layout}
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <div className={styles.steps}>
              {/* 1. Le bouquet */}
              <fieldset className={styles.step}>
                <legend className={styles.legend}>
                  <span className={styles.number}>1</span>Le bouquet
                </legend>
                <div className={styles.bouquetRow}>
                  {photo && bouquet ? (
                    <Photo src={photo.src} file={photo.file} alt={`Le bouquet ${bouquet.nom}.`} ratio="4 / 5" sizes="96px" className={styles.thumb} />
                  ) : (
                    <div className={styles.thumbEmpty} aria-hidden="true" />
                  )}
                  <div className={styles.bouquetFields}>
                    <label className={styles.field}>
                      <span className={styles.label}>Bouquet</span>
                      <select
                        id="commande-bouquet"
                        className={styles.input}
                        value={bouquet?.slug ?? ""}
                        onChange={(event) => {
                          setDraft(event.target.value, taille);
                          setErrors((current) => ({ ...current, bouquet: undefined }));
                        }}
                        aria-invalid={Boolean(errors.bouquet)}
                        aria-describedby={errorId("bouquet")}
                      >
                        <option value="" disabled>
                          Choisissez un bouquet
                        </option>
                        {BOUQUETS.map(({ slug, nom, prix }) => (
                          <option key={slug} value={slug}>
                            {nom}, dès {formatPrice(prix.S)}
                          </option>
                        ))}
                      </select>
                    </label>
                    {errorText("bouquet")}
                    <div className={styles.sizes} role="radiogroup" aria-label="Taille">
                      {TAILLES.map((t) => (
                        <label key={t} className={styles.size}>
                          <input type="radio" name="taille" value={t} checked={taille === t} disabled={!bouquet} onChange={() => setDraftSize(t)} />
                          <span className={styles.sizeLetter}>{t}</span>
                          <span className={styles.sizePrice}>{bouquet ? formatPrice(bouquet.prix[t]) : "–"}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 2. Retrait ou livraison */}
              <fieldset className={styles.step}>
                <legend className={styles.legend}>
                  <span className={styles.number}>2</span>Retrait ou livraison
                </legend>
                <div className={styles.modes}>
                  <label className={styles.option}>
                    <input type="radio" name="mode" value="livraison" checked={mode === "livraison"} onChange={() => setMode("livraison")} />
                    <span className={styles.optionTitle}>Livraison</span>
                    <span className={styles.optionText}>De 8 à 12 € selon le quartier</span>
                  </label>
                  <label className={styles.option}>
                    <input type="radio" name="mode" value="retrait" checked={mode === "retrait"} onChange={() => setMode("retrait")} />
                    <span className={styles.optionTitle}>Je passe à la boutique</span>
                    <span className={styles.optionText}>Gratuit, {BOUTIQUE.street}</span>
                  </label>
                </div>

                <AnimatePresence initial={false}>
                  {mode === "livraison" && (
                    <motion.div
                      key="livraison"
                      className={styles.delivery}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                    >
                      <div className={styles.deliveryInner}>
                        <div
                          id="commande-quartier"
                          className={styles.quartiers}
                          role="radiogroup"
                          aria-label="Quartier de livraison"
                          tabIndex={-1}
                          aria-describedby={errorId("quartier")}
                        >
                          {QUARTIERS.map(({ id, nom, codePostal, tarif }) => (
                            <label key={id} className={styles.quartier}>
                              <input type="radio" name="quartier" value={id} checked={fields.quartier === id} onChange={() => set("quartier")(id)} />
                              <span className={styles.quartierName}>{nom}</span>
                              <span className={styles.quartierCode}>{codePostal}</span>
                              <span className={styles.quartierPrice}>{formatPrice(tarif)}</span>
                            </label>
                          ))}
                        </div>
                        {errorText("quartier")}
                        <p className={styles.hint}>Plus loin, appelez-moi : je trouve souvent une solution.</p>

                        <div className={styles.grid2}>
                          <label className={`${styles.field} ${styles.span2}`}>
                            <span className={styles.label}>Adresse</span>
                            <input
                              id="commande-adresse"
                              className={styles.input}
                              autoComplete="shipping street-address"
                              value={fields.adresse}
                              onChange={(event) => set("adresse")(event.target.value)}
                              aria-invalid={Boolean(errors.adresse)}
                              aria-describedby={errorId("adresse")}
                            />
                            {errorText("adresse")}
                          </label>
                          <label className={`${styles.field} ${styles.span2}`}>
                            <span className={styles.label}>
                              Étage, code, interphone <span className={styles.optional}>facultatif</span>
                            </span>
                            <input className={styles.input} value={fields.complement} onChange={(event) => set("complement")(event.target.value)} />
                          </label>
                          <label className={styles.field}>
                            <span className={styles.label}>Pour qui ?</span>
                            <input
                              id="commande-destinataire"
                              className={styles.input}
                              autoComplete="shipping name"
                              value={fields.destinataire}
                              onChange={(event) => set("destinataire")(event.target.value)}
                              aria-invalid={Boolean(errors.destinataire)}
                              aria-describedby={errorId("destinataire")}
                            />
                            {errorText("destinataire")}
                          </label>
                          <label className={styles.field}>
                            <span className={styles.label}>
                              Son téléphone <span className={styles.optional}>facultatif</span>
                            </span>
                            <input
                              id="commande-telephoneDestinataire"
                              className={styles.input}
                              type="tel"
                              inputMode="tel"
                              value={fields.telephoneDestinataire}
                              onChange={(event) => set("telephoneDestinataire")(event.target.value)}
                              aria-invalid={Boolean(errors.telephoneDestinataire)}
                              aria-describedby={errorId("telephoneDestinataire")}
                            />
                            {errorText("telephoneDestinataire")}
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </fieldset>

              {/* 3. Le jour */}
              <fieldset className={styles.step}>
                <legend className={styles.legend}>
                  <span className={styles.number}>3</span>
                  {mode === "livraison" ? "Le jour de livraison" : "Le jour du retrait"}
                </legend>
                <div className={styles.days} role="radiogroup" aria-label="Jour">
                  {days.map(({ key, top, bottom, long }) => (
                    <label key={key} className={styles.day} title={long}>
                      <input
                        type="radio"
                        name="jour"
                        value={key}
                        checked={day?.key === key}
                        onChange={() => setChosenDay(key)}
                        id={day?.key === key ? "commande-creneau" : undefined}
                        aria-describedby={errorId("creneau")}
                      />
                      <span className={styles.dayTop}>{top}</span>
                      <span className={styles.dayBottom}>{bottom}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.slots} role="radiogroup" aria-label="Créneau">
                  {slots.map(({ id, label, available }) => (
                    <label key={id} className={styles.slot}>
                      <input type="radio" name="creneau" value={id} checked={slot?.id === id} disabled={!available} onChange={() => setChosenSlot(id)} />
                      <span>{label}</span>
                      {!available && <span className={styles.slotOut}>trop tard</span>}
                    </label>
                  ))}
                </div>
                {errorText("creneau")}
              </fieldset>

              {/* 4. La carte */}
              <fieldset className={styles.step}>
                <legend className={styles.legend}>
                  <span className={styles.number}>4</span>La carte
                </legend>
                <label className={styles.field}>
                  <span className={styles.label}>
                    Votre message, je l&apos;écris à la main <span className={styles.optional}>facultatif</span>
                  </span>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    maxLength={COMMANDE.carteMax}
                    value={fields.carte}
                    onChange={(event) => set("carte")(event.target.value)}
                    aria-describedby="commande-carte-compte"
                  />
                </label>
                <p id="commande-carte-compte" className={styles.count}>
                  {fields.carte.length} / {COMMANDE.carteMax}
                </p>
              </fieldset>

              {/* 5. Vos coordonnées */}
              <fieldset className={styles.step}>
                <legend className={styles.legend}>
                  <span className={styles.number}>5</span>Vos coordonnées
                </legend>
                <div className={styles.grid2}>
                  <label className={`${styles.field} ${styles.span2}`}>
                    <span className={styles.label}>Nom</span>
                    <input
                      id="commande-nom"
                      className={styles.input}
                      autoComplete="name"
                      value={fields.nom}
                      onChange={(event) => set("nom")(event.target.value)}
                      aria-invalid={Boolean(errors.nom)}
                      aria-describedby={errorId("nom")}
                    />
                    {errorText("nom")}
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>Téléphone</span>
                    <input
                      id="commande-telephone"
                      className={styles.input}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={fields.telephone}
                      onChange={(event) => set("telephone")(event.target.value)}
                      aria-invalid={Boolean(errors.telephone)}
                      aria-describedby={errorId("telephone")}
                    />
                    {errorText("telephone")}
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>E-mail</span>
                    <input
                      id="commande-email"
                      className={styles.input}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={fields.email}
                      onChange={(event) => set("email")(event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errorId("email")}
                    />
                    {errorText("email")}
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Le récapitulatif reste à côté du formulaire sur ordinateur, et le termine sur téléphone. */}
            <aside className={styles.summary} aria-label="Récapitulatif">
              <dl className={styles.lines}>
                <div>
                  <dt>{bouquet ? `${bouquet.nom}, taille ${taille}` : "Bouquet"}</dt>
                  <dd>{bouquet ? formatPrice(bouquet.prix[taille]) : "–"}</dd>
                </div>
                <div>
                  <dt>{mode === "livraison" ? `Livraison${quartier ? `, ${quartier.nom}` : ""}` : "Retrait en boutique"}</dt>
                  <dd>{mode === "livraison" ? (quartier ? formatPrice(quartier.tarif) : "–") : "Gratuit"}</dd>
                </div>
                <div>
                  <dt>Quand</dt>
                  <dd className={styles.when}>{day && slot ? `${day.long}, ${slot.label}` : "–"}</dd>
                </div>
              </dl>
              <p className={styles.total}>
                <span>Total</span>
                <motion.span key={total} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  {formatPrice(total)}
                </motion.span>
              </p>
              <motion.button type="submit" className={styles.submit} disabled={sending} whileTap={{ scale: 0.98 }}>
                {sending ? "Envoi en cours…" : "Confirmer la commande"}
              </motion.button>
              <p className={styles.concept}>Projet concept : la commande n&apos;est ni envoyée ni payée.</p>
            </aside>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
