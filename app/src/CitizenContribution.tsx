import { useState, type FormEvent } from "react";
import { buildContributionDraft } from "./data/contribution-draft";

export default function CitizenContribution() {
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [contact, setContact] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setDraft(buildContributionDraft({ subject, detail, sourceTitle, sourceUrl, contact }));
      setStatus("Proposition préparée sur cet appareil. Rien n’a été envoyé.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Impossible de préparer cette proposition.");
      setDraft("");
    }
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("Proposition copiée. Vous pouvez la transmettre aux responsables du projet.");
    } catch {
      setStatus("Copie indisponible : sélectionnez et copiez le texte ci-dessous manuellement.");
    }
  }

  return (
    <section className="public-tool-panel contribution-panel" aria-labelledby="contribution-title">
      <div className="public-tool-heading"><div>
        <h3 id="contribution-title">Préparer une contribution ou une correction</h3>
        <p>Signalez une source, une information manquante ou une erreur. Le formulaire prépare un texte sur votre appareil : il ne transmet aucune donnée et ne publie rien automatiquement.</p>
      </div></div>
      <form className="contribution-form" onSubmit={prepare}>
        <label htmlFor="contribution-subject">Dossier ou sujet concerné</label>
        <input id="contribution-subject" required maxLength={160} value={subject} onChange={(event) => setSubject(event.currentTarget.value)} />
        <label htmlFor="contribution-detail">Information proposée ou correction</label>
        <textarea id="contribution-detail" required minLength={20} maxLength={5000} rows={5} value={detail} onChange={(event) => setDetail(event.currentTarget.value)} placeholder="Décrivez précisément le fait, le contexte, la période et ce qui devrait être corrigé." />
        <label htmlFor="contribution-source-title">Titre de la source</label>
        <input id="contribution-source-title" required maxLength={240} value={sourceTitle} onChange={(event) => setSourceTitle(event.currentTarget.value)} />
        <label htmlFor="contribution-source-url">Lien de la source (HTTP ou HTTPS)</label>
        <input id="contribution-source-url" type="url" required value={sourceUrl} onChange={(event) => setSourceUrl(event.currentTarget.value)} placeholder="https://…" />
        <label htmlFor="contribution-contact">Contact facultatif</label>
        <input id="contribution-contact" type="text" maxLength={200} value={contact} onChange={(event) => setContact(event.currentTarget.value)} />
        <button className="contribution-prepare" type="submit">Préparer la proposition</button>
      </form>
      {status && <p className="contribution-status" role="status" aria-live="polite">{status}</p>}
      {draft && <div className="contribution-output">
        <label htmlFor="contribution-draft">Proposition prête à copier</label>
        <textarea id="contribution-draft" rows={12} readOnly value={draft} onFocus={(event) => event.currentTarget.select()} />
        <button className="share-button" type="button" onClick={copyDraft}>Copier le texte</button>
      </div>}
      <p className="comparison-caveat">Ne transmettez pas de données personnelles sensibles. Une proposition ne devient pas un contenu public avant son examen et son acceptation éditoriale.</p>
    </section>
  );
}
