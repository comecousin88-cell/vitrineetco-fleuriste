"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import Photo from "@/components/Photo";
import { FORMULES, JOURS_LIVRAISON, PHOTOS, RYTHMES, type Public, type RythmeId } from "@/data/abonnement";
import { QUARTIERS } from "@/data/livraison";
import { formatPrice } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import { submitSubscription, type SubscriptionRequest } from "@/lib/requests";
import { emailError, nameError, phoneError, requiredError } from "@/lib/validation";
// Les champs et le récapitulatif ont la même forme que la commande de bouquets.
import f from "./Commander.module.css";
import c from "./OrderConfirmation.module.css";
import styles from "./Abonnement.module.css";

type Fields = { quartier: string; adresse: string; entreprise: string; nom: string; telephone: string; email: string };
const EMPTY: Fields = { quartier: "", adresse: "", entreprise: "", nom: "", telephone: "", email: "" };
type Errors = Partial<Record<keyof Fields, string>>;
const ORDER: (keyof Errors)[] = ["entreprise", "quartier", "adresse", "nom", "telephone", "email"];

const PUBLICS: { id: Public; label: string }[] = [
  { id: "particulier", label: "Chez moi" },
  { id: "entreprise", label: "Pour mon entreprise" },
];

export default function Abonnement() {
  const [audience, setAudience] = useState<Public>("particulier");
  const [formuleId, setFormuleId] = useState<Record<Public, string>>({ particulier: "moyen", entreprise: "comptoir" });
  const [rythme, setRythme] = useState<RythmeId>("hebdo");
  const [jour, setJour] = useState<string>("vendredi");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ reference: string; request: SubscriptionRequest } | null>(null);

  const formules = FORMULES[audience];
  const formule = formules.find(({ id }) => id === formuleId[audience]) ?? formules[0];
  const rhythm = RYTHMES.find(({ id }) => id === rythme)!;
  const parMois = formule.prix === null ? null : Math.round(formule.prix * rhythm.parMois);
  const pro = audience === "entreprise";

  const set = (key: keyof Fields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate(): Errors {
    const found: Errors = {};
    if (pro) found.entreprise = requiredError(fields.entreprise, "Indiquez le nom de l'entreprise.") ?? undefined;
    if (!fields.quartier) found.quartier = "Choisissez le quartier de livraison.";
    found.adresse = requiredError(fields.adresse, "Indiquez l'adresse de livraison.") ?? undefined;
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
      document.getElementById(`abo-${first}`)?.focus();
      return;
    }
    const request: SubscriptionRequest = {
      public: audience,
      formule: formule.id,
      rythme,
      jour,
      quartier: fields.quartier,
      adresse: fields.adresse.trim(),
      entreprise: pro ? fields.entreprise.trim() : "",
      contact: { nom: fields.nom.trim(), telephone: fields.telephone.trim(), email: fields.email.trim() },
      prixLivraison: formule.prix,
    };
    setSending(true);
    const result = await submitSubscription(request);
    setSending(false);
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    setDone({ reference: result.reference, request });
    document.getElementById("abonnement")?.scrollIntoView({ block: "start" });
  }

  const errorId = (key: keyof Errors) => (errors[key] ? `abo-${key}-erreur` : undefined);
  const errorText = (key: keyof Errors) =>
    errors[key] ? (
      <span id={`abo-${key}-erreur`} className={f.error}>
        {errors[key]}
      </span>
    ) : null;

  const input = (key: keyof Fields, label: string, options: { type?: string; autoComplete?: string; span2?: boolean } = {}) => (
    <label className={`${f.field} ${options.span2 ? f.span2 : ""}`}>
      <span className={f.label}>{label}</span>
      <input
        id={`abo-${key}`}
        className={f.input}
        type={options.type ?? "text"}
        autoComplete={options.autoComplete}
        value={fields[key]}
        onChange={(event) => set(key)(event.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errorId(key)}
      />
      {errorText(key)}
    </label>
  );

  const photo = PHOTOS[audience];
  const firstDelivery = JOURS_LIVRAISON.find(({ id }) => id === jour)?.label.toLowerCase();

  return (
    <section id="abonnement" className={styles.section} aria-labelledby="abonnement-title">
      <div className={styles.head}>
        <h2 id="abonnement-title" className={styles.title} tabIndex={-1}>
          Des fleurs fraîches, sans y penser
        </h2>
        <p className={styles.lead}>Je compose avec les arrivages de la semaine et je livre moi-même. Sans engagement : on fait une pause quand vous partez.</p>
      </div>

      <div className={styles.audience} role="radiogroup" aria-label="Pour qui ?">
        {PUBLICS.map(({ id, label }) => (
          <label key={id} className={styles.audienceOption}>
            <input type="radio" name="public" value={id} checked={audience === id} onChange={() => setAudience(id)} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="merci" className={c.box} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE_OUT }} role="status">
            <p className={c.title}>Bienvenue, {done.request.contact.nom.split(/\s+/)[0]}.</p>
            <p className={c.text}>
              {done.request.prixLivraison === null
                ? "Je passe vous voir pour regarder les pièces à fleurir, puis je vous envoie une proposition."
                : `Je vous appelle pour fixer la première livraison, ${firstDelivery} prochain.`}
            </p>
            <dl className={c.lines}>
              <div>
                <dt>Référence</dt>
                <dd className={c.reference}>{done.reference}</dd>
              </div>
              <div>
                <dt>Formule</dt>
                <dd>
                  {FORMULES[done.request.public].find(({ id }) => id === done.request.formule)?.nom}, {RYTHMES.find(({ id }) => id === done.request.rythme)?.label.toLowerCase()}
                </dd>
              </div>
              <div className={c.totalLine}>
                <dt>Par livraison</dt>
                <dd>{done.request.prixLivraison === null ? "Sur devis" : formatPrice(done.request.prixLivraison)}</dd>
              </div>
            </dl>
            <p className={c.note}>Projet concept : rien n&apos;a été envoyé ni payé.</p>
            <button type="button" className={c.restart} onClick={() => setDone(null)}>
              Revenir aux formules
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" className={styles.layout} noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {/* La photo change avec le public : une cuisine, ou un comptoir d'accueil. */}
            <div className={styles.photoCol}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={audience}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Photo src={photo.src} file={photo.file} alt={photo.alt} sizes="(min-width: 1024px) 30vw, 100vw" className={styles.photo} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={styles.steps}>
              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>1</span>La formule
                </legend>
                <div className={styles.formules} role="radiogroup" aria-label="Formule">
                  {formules.map(({ id, nom, detail, prix }) => (
                    <label key={id} className={`${f.option} ${styles.formule}`}>
                      <input
                        type="radio"
                        name="formule"
                        value={id}
                        checked={formule.id === id}
                        onChange={() => setFormuleId((current) => ({ ...current, [audience]: id }))}
                      />
                      <span className={styles.formuleTop}>
                        <span className={f.optionTitle}>{nom}</span>
                        <span className={styles.formulePrice}>{prix === null ? "Sur devis" : formatPrice(prix)}</span>
                      </span>
                      <span className={f.optionText}>{detail}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>2</span>Le rythme
                </legend>
                <div className={styles.pair} role="radiogroup" aria-label="Rythme">
                  {RYTHMES.map(({ id, label }) => (
                    <label key={id} className={f.slot}>
                      <input type="radio" name="rythme" value={id} checked={rythme === id} onChange={() => setRythme(id)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <div className={`${styles.pair} ${styles.after}`} role="radiogroup" aria-label="Jour de livraison">
                  {JOURS_LIVRAISON.map(({ id, label }) => (
                    <label key={id} className={f.slot}>
                      <input type="radio" name="jour" value={id} checked={jour === id} onChange={() => setJour(id)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>3</span>Où et qui
                </legend>
                <div className={f.grid2}>
                  {pro && input("entreprise", "Entreprise", { span2: true, autoComplete: "organization" })}
                  <label className={`${f.field} ${f.span2}`}>
                    <span className={f.label}>Quartier</span>
                    <select
                      id="abo-quartier"
                      className={f.input}
                      value={fields.quartier}
                      onChange={(event) => set("quartier")(event.target.value)}
                      aria-invalid={Boolean(errors.quartier)}
                      aria-describedby={errorId("quartier")}
                    >
                      <option value="" disabled>
                        Choisissez le quartier
                      </option>
                      {QUARTIERS.map(({ id, nom }) => (
                        <option key={id} value={id}>
                          {nom}
                        </option>
                      ))}
                    </select>
                    {errorText("quartier")}
                  </label>
                  {input("adresse", "Adresse", { span2: true, autoComplete: "street-address" })}
                  {input("nom", pro ? "Votre nom" : "Nom", { span2: true, autoComplete: "name" })}
                  {input("telephone", "Téléphone", { type: "tel", autoComplete: "tel" })}
                  {input("email", "E-mail", { type: "email", autoComplete: "email" })}
                </div>
              </fieldset>
            </div>

            <aside className={`${f.summary} ${styles.summary}`} aria-label="Récapitulatif">
              <dl className={f.lines}>
                <div>
                  <dt>{formule.nom}</dt>
                  <dd>{formule.prix === null ? "Sur devis" : `${formatPrice(formule.prix)} la livraison`}</dd>
                </div>
                <div>
                  <dt>Livraison</dt>
                  <dd>Comprise</dd>
                </div>
              </dl>
              <p className={f.total}>
                <span>Par mois</span>
                <span>{parMois === null ? "Sur devis" : `≈ ${formatPrice(parMois)}`}</span>
              </p>
              <motion.button type="submit" className={f.submit} disabled={sending} whileTap={{ scale: 0.98 }}>
                {sending ? "Envoi en cours…" : formule.prix === null ? "Recevoir une proposition" : "M'abonner"}
              </motion.button>
              <p className={f.concept}>Sans engagement. Projet concept : rien n&apos;est envoyé ni payé.</p>
            </aside>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
