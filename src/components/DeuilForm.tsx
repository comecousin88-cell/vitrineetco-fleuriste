"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BOUTIQUE, telHref } from "@/data/boutique";
import { COMPOSITIONS, DEUIL, LIEUX, type LieuType } from "@/data/deuil";
import { QUARTIERS } from "@/data/livraison";
import { formatPrice } from "@/lib/format";
import { formatTime, parisNow } from "@/lib/hours";
import { EASE_OUT } from "@/lib/motion";
import { submitFuneralOrder, type FuneralOrderRequest } from "@/lib/order";
import { addDays, longDate, todayKey } from "@/lib/slots";
import { useNow } from "@/lib/useNow";
import { emailError, nameError, phoneError, requiredError } from "@/lib/validation";
// Les champs, les étapes et le récapitulatif ont la même forme que la commande de bouquets.
import f from "./Commander.module.css";
import c from "./OrderConfirmation.module.css";
import styles from "./Deuil.module.css";

type Fields = {
  lieuNom: string;
  adresse: string;
  commune: string;
  date: string;
  heure: string;
  defunt: string;
  ruban: string;
  carte: string;
  nom: string;
  telephone: string;
  email: string;
};

const EMPTY: Fields = { lieuNom: "", adresse: "", commune: "", date: "", heure: "", defunt: "", ruban: "", carte: "", nom: "", telephone: "", email: "" };

type Errors = Partial<Record<keyof Fields | "composition", string>>;
const ORDER: (keyof Errors)[] = ["composition", "lieuNom", "adresse", "commune", "date", "heure", "defunt", "nom", "telephone", "email"];

const minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// "10:30" devient "09:30" : l'heure de livraison, une heure avant la cérémonie.
const hourBefore = (time: string) => {
  const total = Math.max(minutes(time) - 60, 0);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

type Props = { composition: string; onCompositionChange: (slug: string) => void };

export default function DeuilForm({ composition, onCompositionChange }: Props) {
  const now = useNow();
  const [lieu, setLieu] = useState<LieuType>("funerarium");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState<{ reference: string; request: FuneralOrderRequest } | null>(null);

  const chosen = COMPOSITIONS.find(({ slug }) => slug === composition);
  const elsewhere = fields.commune === "autre";
  const quartier = QUARTIERS.find(({ id }) => id === fields.commune);
  const today = now ? todayKey(now) : "";

  const set = (key: keyof Fields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate(): Errors {
    const found: Errors = {};
    if (!chosen) found.composition = "Choisissez une composition.";
    found.lieuNom = requiredError(fields.lieuNom, "Indiquez le nom du lieu, par exemple le nom du funérarium.") ?? undefined;
    found.adresse = requiredError(fields.adresse, "Indiquez l'adresse du lieu.") ?? undefined;
    if (!fields.commune) found.commune = "Choisissez la commune.";
    if (!fields.date) found.date = "Indiquez la date de la cérémonie.";
    else if (now && fields.date < today) found.date = "Cette date est passée.";
    else if (now && fields.date > addDays(today, 60)) found.date = "Pour une date aussi lointaine, appelez-moi.";
    if (!fields.heure) found.heure = "Indiquez l'heure de la cérémonie.";
    else if (now && fields.date === today && minutes(fields.heure) < minutes(parisNow(now).time) + DEUIL.delaiHeures * 60) {
      found.heure = `Pour une cérémonie aujourd'hui à cette heure-ci, appelez-moi au ${BOUTIQUE.phone} : je vois ce que je peux faire.`;
    }
    found.defunt = requiredError(fields.defunt, "Indiquez le nom de la personne, pour que la livraison arrive au bon endroit.") ?? undefined;
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
      document.getElementById(`deuil-${first}`)?.focus();
      return;
    }
    if (!chosen) return;
    const request: FuneralOrderRequest = {
      composition: chosen.slug,
      lieu: { type: lieu, nom: fields.lieuNom.trim(), adresse: fields.adresse.trim(), commune: fields.commune },
      ceremonie: { date: fields.date, heure: fields.heure },
      defunt: fields.defunt.trim(),
      ruban: fields.ruban.trim(),
      carte: fields.carte.trim(),
      client: { nom: fields.nom.trim(), telephone: fields.telephone.trim(), email: fields.email.trim() },
      total: chosen.prix,
    };
    setSending(true);
    const result = await submitFuneralOrder(request);
    setSending(false);
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    setConfirmed({ reference: result.reference, request });
    document.getElementById("commande-deuil")?.scrollIntoView({ block: "start" });
  }

  const errorId = (key: keyof Errors) => (errors[key] ? `deuil-${key}-erreur` : undefined);
  const errorText = (key: keyof Errors) =>
    errors[key] ? (
      <span id={`deuil-${key}-erreur`} className={f.error}>
        {errors[key]}
      </span>
    ) : null;

  // Un champ texte complet : libellé, saisie, erreur. Une fonction, et pas un composant, pour garder le focus.
  const input = (key: keyof Fields, label: string, options: { optional?: boolean; type?: string; autoComplete?: string; maxLength?: number; span2?: boolean } = {}) => (
    <label className={`${f.field} ${options.span2 ? f.span2 : ""}`}>
      <span className={f.label}>
        {label} {options.optional && <span className={f.optional}>facultatif</span>}
      </span>
      <input
        id={`deuil-${key}`}
        className={f.input}
        type={options.type ?? "text"}
        autoComplete={options.autoComplete}
        maxLength={options.maxLength}
        min={options.type === "date" ? today : undefined}
        value={fields[key]}
        onChange={(event) => set(key)(event.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errorId(key)}
      />
      {errorText(key)}
    </label>
  );

  return (
    <section id="commande-deuil" className={styles.order} aria-labelledby="commande-deuil-title">
      <div className={styles.orderHead}>
        <h2 id="commande-deuil-title" className={styles.h2} tabIndex={-1}>
          Commander
        </h2>
        <p className={styles.orderLead}>
          Je livre au funérarium, au lieu de culte ou au cimetière, au plus tard une heure avant la cérémonie. La livraison est offerte dans
          mes quartiers.
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {confirmed ? (
          <motion.div
            key="confirmation"
            className={c.box}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            role="status"
          >
            <p className={c.title}>Merci, c&apos;est noté.</p>
            <p className={c.text}>
              Je livre la composition à {confirmed.request.lieu.nom} le {longDate(confirmed.request.ceremonie.date).toLowerCase()}, au plus tard à{" "}
              {formatTime(hourBefore(confirmed.request.ceremonie.heure))}, une heure avant la cérémonie.
            </p>
            <dl className={c.lines}>
              <div>
                <dt>Référence</dt>
                <dd className={c.reference}>{confirmed.reference}</dd>
              </div>
              <div>
                <dt>Composition</dt>
                <dd>{COMPOSITIONS.find(({ slug }) => slug === confirmed.request.composition)?.nom}</dd>
              </div>
              <div>
                <dt>Pour</dt>
                <dd>{confirmed.request.defunt}</dd>
              </div>
              {confirmed.request.ruban && (
                <div>
                  <dt>Ruban</dt>
                  <dd className={c.card}>{confirmed.request.ruban}</dd>
                </div>
              )}
              <div className={c.totalLine}>
                <dt>Total</dt>
                <dd>{formatPrice(confirmed.request.total)}</dd>
              </div>
            </dl>
            <p className={c.note}>
              Projet concept : rien n&apos;a été envoyé ni payé. Dans la vraie boutique, je vous rappellerais pour confirmer, au{" "}
              {confirmed.request.client.telephone}.
            </p>
          </motion.div>
        ) : (
          <motion.form key="formulaire" className={f.layout} noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={f.steps}>
              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>1</span>La composition
                </legend>
                <label className={f.field}>
                  <span className={f.label}>Composition</span>
                  <select
                    id="deuil-composition"
                    className={f.input}
                    value={composition}
                    onChange={(event) => {
                      onCompositionChange(event.target.value);
                      setErrors((current) => ({ ...current, composition: undefined }));
                    }}
                    aria-invalid={Boolean(errors.composition)}
                    aria-describedby={errorId("composition")}
                  >
                    <option value="" disabled>
                      Choisissez une composition
                    </option>
                    {COMPOSITIONS.map(({ slug, nom, prix }) => (
                      <option key={slug} value={slug}>
                        {nom}, {formatPrice(prix)}
                      </option>
                    ))}
                  </select>
                  {errorText("composition")}
                </label>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>2</span>Le lieu de la cérémonie
                </legend>
                <div className={styles.lieux} role="radiogroup" aria-label="Type de lieu">
                  {LIEUX.map(({ id, label }) => (
                    <label key={id} className={f.slot}>
                      <input type="radio" name="lieu" value={id} checked={lieu === id} onChange={() => setLieu(id)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <div className={`${f.grid2} ${styles.afterChoice}`}>
                  {input("lieuNom", lieu === "domicile" ? "Nom sur la porte" : "Nom du lieu", { span2: true })}
                  {input("adresse", "Adresse", { span2: true, autoComplete: "street-address" })}
                  <label className={`${f.field} ${f.span2}`}>
                    <span className={f.label}>Commune</span>
                    <select
                      id="deuil-commune"
                      className={f.input}
                      value={fields.commune}
                      onChange={(event) => set("commune")(event.target.value)}
                      aria-invalid={Boolean(errors.commune)}
                      aria-describedby={errorId("commune")}
                    >
                      <option value="" disabled>
                        Choisissez la commune
                      </option>
                      {QUARTIERS.map(({ id, nom }) => (
                        <option key={id} value={id}>
                          {nom}, livraison offerte
                        </option>
                      ))}
                      <option value="autre">Ailleurs, je vous rappelle pour la livraison</option>
                    </select>
                    {errorText("commune")}
                  </label>
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>3</span>La cérémonie
                </legend>
                <div className={f.grid2}>
                  {input("date", "Date", { type: "date" })}
                  {input("heure", "Heure", { type: "time" })}
                  {input("defunt", "Nom de la personne disparue", { span2: true })}
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>4</span>Ruban et carte
                </legend>
                <div className={f.grid2}>
                  {input("ruban", "Inscription sur le ruban", { optional: true, maxLength: DEUIL.rubanMax, span2: true })}
                  <label className={`${f.field} ${f.span2}`}>
                    <span className={f.label}>
                      Un mot pour la famille, que j&apos;écris à la main <span className={f.optional}>facultatif</span>
                    </span>
                    <textarea className={`${f.input} ${f.textarea}`} rows={3} maxLength={250} value={fields.carte} onChange={(event) => set("carte")(event.target.value)} />
                  </label>
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>5</span>Vos coordonnées
                </legend>
                <div className={f.grid2}>
                  {input("nom", "Nom", { span2: true, autoComplete: "name" })}
                  {input("telephone", "Téléphone", { type: "tel", autoComplete: "tel" })}
                  {input("email", "E-mail", { type: "email", autoComplete: "email" })}
                </div>
              </fieldset>
            </div>

            <aside className={f.summary} aria-label="Récapitulatif">
              <dl className={f.lines}>
                <div>
                  <dt>{chosen ? chosen.nom : "Composition"}</dt>
                  <dd>{chosen ? formatPrice(chosen.prix) : "–"}</dd>
                </div>
                <div>
                  <dt>Livraison{quartier ? `, ${quartier.nom}` : ""}</dt>
                  <dd>{elsewhere ? "À confirmer" : quartier ? "Offerte" : "–"}</dd>
                </div>
                <div>
                  <dt>Cérémonie</dt>
                  <dd className={f.when}>
                    {fields.date ? longDate(fields.date) : "–"}
                    {fields.date && fields.heure ? `, ${formatTime(fields.heure)}` : ""}
                  </dd>
                </div>
              </dl>
              <p className={f.total}>
                <span>Total</span>
                <span>{formatPrice(chosen?.prix ?? 0)}</span>
              </p>
              <motion.button type="submit" className={`${f.submit} ${styles.submit}`} disabled={sending} whileTap={{ scale: 0.98 }}>
                {sending ? "Envoi en cours…" : "Confirmer la commande"}
              </motion.button>
              <p className={f.concept}>
                Ou appelez-moi au{" "}
                <a href={telHref(BOUTIQUE.phone)} className={styles.inlinePhone}>
                  {BOUTIQUE.phone}
                </a>
                . Projet concept : rien n&apos;est envoyé ni payé.
              </p>
            </aside>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
