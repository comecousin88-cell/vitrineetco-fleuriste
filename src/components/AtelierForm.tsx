"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ATELIERS, THEMES, type Session } from "@/data/ateliers";
import { placesLabel, shortDate } from "@/lib/ateliers";
import { formatPrice } from "@/lib/format";
import { formatTime } from "@/lib/hours";
import { EASE_OUT } from "@/lib/motion";
import { submitBooking, type BookingRequest } from "@/lib/requests";
import { emailError, nameError, phoneError, requiredError } from "@/lib/validation";
// Les champs, les étapes et le récapitulatif ont la même forme que la commande de bouquets.
import f from "./Commander.module.css";
import c from "./OrderConfirmation.module.css";
import styles from "./AtelierForm.module.css";

type Fields = { pour: string; message: string; nom: string; telephone: string; email: string };
const EMPTY: Fields = { pour: "", message: "", nom: "", telephone: "", email: "" };
type Errors = Partial<Record<keyof Fields | "session", string>>;
const ORDER: (keyof Errors)[] = ["session", "pour", "nom", "telephone", "email"];

type Props = {
  sessions: Session[];
  chosen: string;
  onChoose: (id: string) => void;
  onBooked: (id: string, places: number) => void;
};

export default function AtelierForm({ sessions, chosen, onChoose, onBooked }: Props) {
  const [count, setCount] = useState(1);
  const [gift, setGift] = useState(false);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ reference: string; request: BookingRequest; label: string } | null>(null);

  const session = sessions.find(({ id }) => id === chosen && chosen && id) ?? null;
  const theme = session ? THEMES.find(({ slug }) => slug === session.theme) : undefined;
  const max = session ? Math.min(session.restantes, ATELIERS.maxParReservation) : ATELIERS.maxParReservation;
  // Si la séance choisie a moins de places que demandé, on ramène le nombre à ce qui reste.
  const places = Math.max(1, Math.min(count, max));
  const total = theme ? theme.prix * places : 0;
  const label = (s: Session) => {
    const t = THEMES.find(({ slug }) => slug === s.theme)!;
    return `${shortDate(s.date)}, ${formatTime(s.debut)}, ${t.nom}`;
  };

  const set = (key: keyof Fields) => (value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate(): Errors {
    const found: Errors = {};
    if (!session) found.session = "Choisissez une date.";
    if (gift) found.pour = requiredError(fields.pour, "Indiquez le nom de la personne à qui vous l'offrez.") ?? undefined;
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
      document.getElementById(`atelier-${first}`)?.focus();
      return;
    }
    if (!session) return;
    const request: BookingRequest = {
      session: session.id,
      places,
      cadeau: gift ? { pour: fields.pour.trim() } : null,
      message: fields.message.trim(),
      contact: { nom: fields.nom.trim(), telephone: fields.telephone.trim(), email: fields.email.trim() },
      total,
    };
    setSending(true);
    const result = await submitBooking(request);
    setSending(false);
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    setDone({ reference: result.reference, request, label: label(session) });
    onBooked(session.id, places);
    document.getElementById("reserver-atelier")?.scrollIntoView({ block: "start" });
  }

  function restart() {
    setDone(null);
    setFields(EMPTY);
    setCount(1);
    setGift(false);
    onChoose("");
  }

  const errorId = (key: keyof Errors) => (errors[key] ? `atelier-${key}-erreur` : undefined);
  const errorText = (key: keyof Errors) =>
    errors[key] ? (
      <span id={`atelier-${key}-erreur`} className={f.error}>
        {errors[key]}
      </span>
    ) : null;

  const input = (key: keyof Fields, labelText: string, options: { type?: string; autoComplete?: string; span2?: boolean } = {}) => (
    <label className={`${f.field} ${options.span2 ? f.span2 : ""}`}>
      <span className={f.label}>{labelText}</span>
      <input
        id={`atelier-${key}`}
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

  return (
    <section id="reserver-atelier" className={styles.section} aria-labelledby="reserver-title">
      <h2 id="reserver-title" className={styles.title} tabIndex={-1}>
        Réserver
      </h2>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="merci" className={c.box} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE_OUT }} role="status">
            <p className={c.title}>
              C&apos;est réservé, {done.request.contact.nom.split(/\s+/)[0]}.
            </p>
            <p className={c.text}>
              {done.request.cadeau
                ? `Je prépare une carte cadeau au nom de ${done.request.cadeau.pour}, à venir chercher à la boutique ou à recevoir par e-mail.`
                : "Je vous attends à la boutique, le café sera prêt."}
            </p>
            <dl className={c.lines}>
              <div>
                <dt>Référence</dt>
                <dd className={c.reference}>{done.reference}</dd>
              </div>
              <div>
                <dt>Atelier</dt>
                <dd>{done.label}</dd>
              </div>
              <div>
                <dt>Places</dt>
                <dd>{done.request.places}</dd>
              </div>
              <div className={c.totalLine}>
                <dt>Total</dt>
                <dd>{formatPrice(done.request.total)}</dd>
              </div>
            </dl>
            <p className={c.note}>Projet concept : rien n&apos;a été envoyé ni payé. Les places restantes ont seulement baissé sur cette page.</p>
            <button type="button" className={c.restart} onClick={restart}>
              Réserver un autre atelier
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" className={f.layout} noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={f.steps}>
              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>1</span>La date
                </legend>
                <label className={f.field}>
                  <span className={f.label}>Atelier</span>
                  <select
                    id="atelier-session"
                    className={f.input}
                    value={session?.id ?? ""}
                    onChange={(event) => {
                      onChoose(event.target.value);
                      setErrors((current) => ({ ...current, session: undefined }));
                    }}
                    aria-invalid={Boolean(errors.session)}
                    aria-describedby={errorId("session")}
                  >
                    <option value="" disabled>
                      Choisissez une date
                    </option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id} disabled={s.restantes === 0}>
                        {label(s)} ({placesLabel(s.restantes).toLowerCase()})
                      </option>
                    ))}
                  </select>
                  {errorText("session")}
                </label>

                <div className={styles.countRow}>
                  <span className={f.label} id="atelier-places-label">
                    Nombre de places
                  </span>
                  <div className={styles.stepper} role="group" aria-labelledby="atelier-places-label">
                    <button type="button" className={styles.stepButton} onClick={() => setCount(places - 1)} disabled={places <= 1} aria-label="Une place de moins">
                      −
                    </button>
                    <output className={styles.count} aria-live="polite">
                      {places}
                    </output>
                    <button type="button" className={styles.stepButton} onClick={() => setCount(places + 1)} disabled={places >= max} aria-label="Une place de plus">
                      +
                    </button>
                  </div>
                  <span className={f.optional}>
                    {session && places >= max && session.restantes <= ATELIERS.maxParReservation
                      ? "Toutes les places restantes"
                      : `${ATELIERS.maxParReservation} au plus par réservation`}
                  </span>
                </div>
              </fieldset>

              <fieldset className={f.step}>
                <legend className={f.legend}>
                  <span className={f.number}>2</span>Pour vous ou à offrir
                </legend>
                <label className={styles.check}>
                  <input type="checkbox" checked={gift} onChange={(event) => setGift(event.target.checked)} />
                  <span>C&apos;est un cadeau : je prépare une carte au nom de la personne</span>
                </label>
                {gift && <div className={styles.afterCheck}>{input("pour", "Pour qui ?")}</div>}
                <label className={`${f.field} ${styles.afterCheck}`}>
                  <span className={f.label}>
                    Une question, une allergie ? <span className={f.optional}>facultatif</span>
                  </span>
                  <textarea className={`${f.input} ${f.textarea}`} rows={3} maxLength={400} value={fields.message} onChange={(event) => set("message")(event.target.value)} />
                </label>
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

            <aside className={f.summary} aria-label="Récapitulatif">
              <dl className={f.lines}>
                <div>
                  <dt>Atelier</dt>
                  <dd className={f.when}>{session ? label(session) : "–"}</dd>
                </div>
                <div>
                  <dt>{theme ? `${places} × ${formatPrice(theme.prix)}` : "Places"}</dt>
                  <dd>{theme ? formatPrice(total) : "–"}</dd>
                </div>
              </dl>
              <p className={f.total}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </p>
              <motion.button type="submit" className={f.submit} disabled={sending} whileTap={{ scale: 0.98 }}>
                {sending ? "Envoi en cours…" : "Réserver"}
              </motion.button>
              <p className={f.concept}>Projet concept : rien n&apos;est envoyé ni payé.</p>
            </aside>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
