"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BUDGETS_DEVIS, DEVIS, TYPES_EVENEMENT } from "@/data/mariages";
import { EASE_OUT } from "@/lib/motion";
import { submitQuote, type QuoteRequest } from "@/lib/requests";
import { addDays, longDate, todayKey } from "@/lib/slots";
import { useNow } from "@/lib/useNow";
import { emailError, nameError, phoneError, requiredError } from "@/lib/validation";
import { BOUTIQUE, telHref } from "@/data/boutique";
// Les champs et les étapes ont la même forme que la commande de bouquets.
import f from "./Commander.module.css";
import c from "./OrderConfirmation.module.css";
import styles from "./DevisForm.module.css";

type Fields = { date: string; lieu: string; invites: string; budget: string; envies: string; nom: string; telephone: string; email: string };
const EMPTY: Fields = { date: "", lieu: "", invites: "", budget: "", envies: "", nom: "", telephone: "", email: "" };

type Errors = Partial<Record<keyof Fields | "photo", string>>;
const ORDER: (keyof Errors)[] = ["date", "lieu", "invites", "budget", "envies", "photo", "nom", "telephone", "email"];

export default function DevisForm() {
  const now = useNow();
  const [type, setType] = useState<(typeof TYPES_EVENEMENT)[number]>("Mariage");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ reference: string; request: QuoteRequest } | null>(null);

  const today = now ? todayKey(now) : "";
  const minDate = today ? addDays(today, DEVIS.delaiMinJours) : undefined;

  const set = (key: keyof Fields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate(): Errors {
    const found: Errors = {};
    if (!fields.date) found.date = "Indiquez la date, même approximative.";
    else if (minDate && fields.date < minDate) found.date = `Pour un événement dans moins de trois semaines, appelez-moi au ${BOUTIQUE.phone}.`;
    else if (today && fields.date > addDays(today, DEVIS.delaiMaxJours)) found.date = "Cette date est très lointaine : vérifiez l'année.";
    found.lieu = requiredError(fields.lieu, "Indiquez le lieu, ou au moins la ville.") ?? undefined;
    const invites = Number(fields.invites);
    if (!/^\d+$/.test(fields.invites.trim()) || invites < 1) found.invites = "Indiquez un nombre d'invités, même approximatif.";
    if (!fields.budget) found.budget = "Choisissez une fourchette, même large.";
    found.envies = requiredError(fields.envies, "Dites-moi en quelques mots ce que vous imaginez.") ?? undefined;
    if (photo && photo.size > DEVIS.photoMaxMo * 1024 * 1024) found.photo = `Cette photo dépasse ${DEVIS.photoMaxMo} Mo : choisissez-en une plus légère.`;
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
      document.getElementById(`devis-${first}`)?.focus();
      return;
    }
    const request: QuoteRequest = {
      type,
      date: fields.date,
      lieu: fields.lieu.trim(),
      invites: Number(fields.invites),
      budget: fields.budget,
      envies: fields.envies.trim(),
      photo,
      contact: { nom: fields.nom.trim(), telephone: fields.telephone.trim(), email: fields.email.trim() },
    };
    setSending(true);
    const result = await submitQuote(request);
    setSending(false);
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    setDone({ reference: result.reference, request });
    document.getElementById("devis")?.scrollIntoView({ block: "start" });
  }

  const errorId = (key: keyof Errors) => (errors[key] ? `devis-${key}-erreur` : undefined);
  const errorText = (key: keyof Errors) =>
    errors[key] ? (
      <span id={`devis-${key}-erreur`} className={f.error}>
        {errors[key]}
      </span>
    ) : null;

  // Un champ complet : libellé, saisie, erreur. Une fonction, et pas un composant, pour garder le focus.
  const input = (key: keyof Fields, label: string, options: { type?: string; autoComplete?: string; span2?: boolean; inputMode?: "numeric" } = {}) => (
    <label className={`${f.field} ${options.span2 ? f.span2 : ""}`}>
      <span className={f.label}>{label}</span>
      <input
        id={`devis-${key}`}
        className={f.input}
        type={options.type ?? "text"}
        inputMode={options.inputMode}
        autoComplete={options.autoComplete}
        min={options.type === "date" ? minDate : undefined}
        value={fields[key]}
        onChange={(event) => set(key)(event.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errorId(key)}
      />
      {errorText(key)}
    </label>
  );

  return (
    <section id="devis" className={styles.section} aria-labelledby="devis-title">
      <div className={styles.head}>
        <h2 id="devis-title" className={styles.title} tabIndex={-1}>
          Demander un devis
        </h2>
        <p className={styles.lead}>Racontez-moi votre journée. Je vous rappelle sous 48 heures pour en parler.</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="merci"
            className={c.box}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            role="status"
          >
            <p className={c.title}>Merci {done.request.contact.nom.split(/\s+/)[0]}, j&apos;ai bien votre demande.</p>
            <p className={c.text}>
              Je vous rappelle sous 48 heures au {done.request.contact.telephone} pour fixer un rendez-vous à la boutique.
            </p>
            <dl className={c.lines}>
              <div>
                <dt>Référence</dt>
                <dd className={c.reference}>{done.reference}</dd>
              </div>
              <div>
                <dt>{done.request.type}</dt>
                <dd>
                  {longDate(done.request.date)}, {done.request.lieu}, {done.request.invites} invités
                </dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{done.request.budget}</dd>
              </div>
              {done.request.photo && (
                <div>
                  <dt>Inspiration</dt>
                  <dd>{done.request.photo.name}</dd>
                </div>
              )}
            </dl>
            <p className={c.note}>Projet concept : rien n&apos;a été envoyé, et la photo n&apos;a pas quitté votre appareil.</p>
          </motion.div>
        ) : (
          <motion.form key="form" className={f.layout} noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={f.steps}>
              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>1</span>L&apos;événement
                </legend>
                <div className={styles.types} role="radiogroup" aria-label="Type d'événement">
                  {TYPES_EVENEMENT.map((label) => (
                    <label key={label} className={f.slot}>
                      <input type="radio" name="type" value={label} checked={type === label} onChange={() => setType(label)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <div className={`${f.grid2} ${styles.afterChoice}`}>
                  {input("date", "Date", { type: "date" })}
                  {input("invites", "Nombre d'invités", { inputMode: "numeric" })}
                  {input("lieu", "Lieu", { span2: true })}
                  <label className={`${f.field} ${f.span2}`}>
                    <span className={f.label}>Budget fleurs</span>
                    <select
                      id="devis-budget"
                      className={f.input}
                      value={fields.budget}
                      onChange={(event) => set("budget")(event.target.value)}
                      aria-invalid={Boolean(errors.budget)}
                      aria-describedby={errorId("budget")}
                    >
                      <option value="" disabled>
                        Choisissez une fourchette
                      </option>
                      {BUDGETS_DEVIS.map((budget) => (
                        <option key={budget} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                    {errorText("budget")}
                  </label>
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>2</span>Vos envies
                </legend>
                <label className={f.field}>
                  <span className={f.label}>Couleurs, fleurs, ambiance, ce que vous ne voulez surtout pas</span>
                  <textarea
                    id="devis-envies"
                    className={`${f.input} ${f.textarea}`}
                    rows={5}
                    maxLength={DEVIS.enviesMax}
                    value={fields.envies}
                    onChange={(event) => set("envies")(event.target.value)}
                    aria-invalid={Boolean(errors.envies)}
                    aria-describedby={errorId("envies")}
                  />
                  {errorText("envies")}
                </label>

                <div className={styles.upload}>
                  <span className={f.label}>
                    Une photo d&apos;inspiration <span className={f.optional}>facultatif</span>
                  </span>
                  <label className={styles.drop}>
                    <input
                      id="devis-photo"
                      type="file"
                      accept="image/*"
                      className={styles.file}
                      onChange={(event) => {
                        setPhoto(event.target.files?.[0] ?? null);
                        setErrors((current) => ({ ...current, photo: undefined }));
                      }}
                      aria-describedby={errorId("photo")}
                    />
                    <span className={styles.dropText}>{photo ? photo.name : "Choisir une image"}</span>
                    {photo && (
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={(event) => {
                          event.preventDefault();
                          setPhoto(null);
                          const element = document.getElementById("devis-photo") as HTMLInputElement | null;
                          if (element) element.value = "";
                        }}
                      >
                        Retirer
                      </button>
                    )}
                  </label>
                  {errorText("photo")}
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>3</span>Vos coordonnées
                </legend>
                <div className={f.grid2}>
                  {input("nom", "Nom", { span2: true, autoComplete: "name" })}
                  {input("telephone", "Téléphone", { type: "tel", autoComplete: "tel" })}
                  {input("email", "E-mail", { type: "email", autoComplete: "email" })}
                </div>
              </fieldset>
            </div>

            <aside className={f.summary} aria-label="La suite">
              <p className={styles.nextTitle}>Ensuite</p>
              <ol className={styles.next}>
                <li>Je vous rappelle sous 48 heures.</li>
                <li>On se retrouve à la boutique, avec quelques fleurs de saison sur la table.</li>
                <li>Je vous envoie un devis détaillé par e-mail.</li>
              </ol>
              <motion.button type="submit" className={f.submit} disabled={sending} whileTap={{ scale: 0.98 }}>
                {sending ? "Envoi en cours…" : "Envoyer ma demande"}
              </motion.button>
              <p className={f.concept}>
                Pressé ? Appelez-moi au{" "}
                <a href={telHref(BOUTIQUE.phone)} className={styles.phone}>
                  {BOUTIQUE.phone}
                </a>
                . Projet concept : rien n&apos;est envoyé.
              </p>
            </aside>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
