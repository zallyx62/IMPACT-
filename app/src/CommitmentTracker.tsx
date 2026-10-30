import { useMemo, useState } from "react";
import { getEntityDossier, type EntityRecord } from "./data/records";
import { buildCommitmentIndex, buildDossierTimeline, getCommitmentDisplayStatus } from "./data/public-tool-index";

const statusLabels: Record<string, string> = {
  announced: "Annoncé", in_progress: "En cours", achieved: "Atteint",
  not_achieved: "Non atteint", abandoned: "Abandonné", unable_to_assess: "Impossible à évaluer", overdue: "Échéance dépassée",
};

function dateLabel(value?: string | null): string {
  if (!value) return "Non précisée";
  const parsed = new Date(value.length === 10 ? value + "T00:00:00" : value);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(parsed);
}

export default function CommitmentTracker({ entities }: { entities: EntityRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const dossiers = useMemo(() => entities.flatMap((entity) => {
    const dossier = getEntityDossier(entity.id);
    return dossier ? [dossier] : [];
  }), [entities]);
  const commitments = useMemo(() => buildCommitmentIndex(dossiers), [dossiers]);
  const timeline = useMemo(() => buildDossierTimeline(dossiers), [dossiers]);
  const normalized = query.trim().toLocaleLowerCase("fr");
  const filtered = commitments.filter(({ entityName, commitment, sourceTitles }) =>
    (status === "all" || getCommitmentDisplayStatus(commitment) === status) &&
    [entityName, commitment.statement, commitment.observed_result, commitment.measurement_method, ...sourceTitles]
      .filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalized));
  const statuses = [...new Set(commitments.map(({ commitment }) => getCommitmentDisplayStatus(commitment)))].sort();
  const filteredTimeline = timeline.filter((event) =>
    [event.entityName, event.title, event.detail, ...event.sourceTitles].join(" ").toLocaleLowerCase("fr").includes(normalized));
  return (
    <section className="public-tool-panel" aria-labelledby="commitment-tracker-title">
      <div className="public-tool-heading">
        <div><h3 id="commitment-tracker-title">Historique des dossiers, engagements et échéances</h3>
          <p>Les annonces, échéances et résultats observés sont séparés. Un engagement annoncé n’est pas considéré comme réalisé sans preuve.</p></div>
        <span className="public-tool-count">{filtered.length} / {commitments.length}</span>
      </div>
      <section className="dossier-timeline" aria-labelledby="dossier-timeline-title">
        <div className="timeline-heading"><h4 id="dossier-timeline-title">Chronologie des éléments datés</h4><span>{filteredTimeline.length} événement(s)</span></div>
        <p className="comparison-caveat">Cette chronologie rassemble les dates présentes dans les dossiers publiés. Elle ne constitue pas un historique exhaustif de toutes les modifications ni une preuve d’absence d’événements lorsqu’une date manque.</p>
        {filteredTimeline.length === 0 ? <p className="empty-state">Aucun événement daté ne correspond à cette recherche.</p> : (
          <ol className="timeline-list">{filteredTimeline.map((event) => (
            <li className="timeline-item" key={event.id}>
              <time dateTime={event.date}>{dateLabel(event.date)}</time>
              <div><strong>{event.title}</strong><span className="timeline-entity">{event.entityName}</span>
                <p>{event.detail}</p>
                {event.sourceTitles.length > 0 && <small>Sources : {event.sourceTitles.join(" · ")}</small>}
              </div>
            </li>
          ))}</ol>
        )}
      </section>
      <div className="public-tool-controls">
        <label className="public-tool-search-label" htmlFor="commitment-search">Rechercher un engagement</label>
        <input id="commitment-search" className="public-tool-search" type="search" value={query}
          onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Organisation, promesse, résultat…" />
        <label className="public-tool-search-label" htmlFor="commitment-status">État de l’engagement</label>
        <select id="commitment-status" className="public-tool-select" value={status} onChange={(event) => setStatus(event.currentTarget.value)}>
          <option value="all">Tous les états</option>
          {statuses.map((value) => <option key={value} value={value}>{statusLabels[value] ?? value}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? <p className="empty-state">{commitments.length === 0
        ? "Aucun engagement vérifié n’est actuellement disponible dans les dossiers publiés."
        : "Aucun engagement ne correspond à ces filtres."}</p> : (
        <div className="commitment-list">
          {filtered.map(({ id, entityName, commitment, sourceTitles }) => (
            <article className="commitment-card" key={id}>
              <div className="commitment-meta"><strong>{entityName}</strong><span>{statusLabels[getCommitmentDisplayStatus(commitment)] ?? commitment.status}</span></div>
              <h4>{commitment.statement}</h4>
              <dl>
                <div><dt>Annoncé</dt><dd>{dateLabel(commitment.announced_at)}</dd></div>
                <div><dt>Échéance cible</dt><dd>{dateLabel(commitment.target_date)}</dd></div>
                {commitment.baseline && <div><dt>Référence initiale</dt><dd>{commitment.baseline}</dd></div>}
                {commitment.target_value && <div><dt>Objectif annoncé</dt><dd>{commitment.target_value}</dd></div>}
                {commitment.observed_result && <div><dt>Résultat observé</dt><dd>{commitment.observed_result}</dd></div>}
                {commitment.measurement_method && <div><dt>Méthode de mesure</dt><dd>{commitment.measurement_method}</dd></div>}
              </dl>
              {sourceTitles.length > 0 && <p className="commitment-sources"><strong>Sources :</strong> {sourceTitles.join(" · ")}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
