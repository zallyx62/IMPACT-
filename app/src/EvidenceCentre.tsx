import { useMemo, useState } from "react";
import { getEntityDossier, type EntityRecord } from "./data/records";
import { buildEvidenceIndex, filterEvidenceIndex, type EvidenceFilter, type EvidenceRelation } from "./data/evidence-index";
import { safeExternalUrl } from "./data/safe-url";

const relationLabels: Record<EvidenceRelation, string> = {
  supports: "À l’appui d’une affirmation",
  contradicts: "Contradictoire ou nuançant",
  mixed: "À la fois favorable et contradictoire",
  context: "Contextuel — portée non déterminée",
};
const filterLabels: Record<EvidenceFilter, string> = {
  all: "Tous", supports: "À l’appui", contradicts: "Contradictoires / nuançants", mixed: "Mixtes", context: "Contextuels",
};

function displayDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
}

export default function EvidenceCentre({ entities }: { entities: EntityRecord[] }) {
  const [query, setQuery] = useState("");
  const [relation, setRelation] = useState<EvidenceFilter>("all");
  const index = useMemo(() => buildEvidenceIndex(entities.flatMap((entity) => {
    const dossier = getEntityDossier(entity.id);
    return dossier ? [dossier] : [];
  })), [entities]);
  const filtered = useMemo(() => filterEvidenceIndex(index, query, relation), [index, query, relation]);

  return (
    <section className="evidence-centre" aria-labelledby="evidence-centre-title">
      <div className="evidence-centre-heading">
        <div>
          <h3 id="evidence-centre-title">Éléments de preuve publiés</h3>
          <p>Chaque élément reste lié à sa source, aux affirmations concernées et à ses limites.</p>
        </div>
        <span className="evidence-count" aria-label={`${filtered.length} éléments affichés sur ${index.length}`}>{filtered.length} / {index.length}</span>
      </div>
      <label className="evidence-search-label" htmlFor="evidence-centre-search">Rechercher dans les preuves</label>
      <input id="evidence-centre-search" className="evidence-search" type="search" value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder="Entreprise, affirmation, source, mot-clé…" autoComplete="off" />
      <div className="evidence-filters" role="group" aria-label="Filtrer par relation avec les affirmations">
        {(Object.keys(filterLabels) as EvidenceFilter[]).map((value) => (
          <button key={value} type="button" className="evidence-filter" aria-pressed={relation === value}
            onClick={() => setRelation(value)}>{filterLabels[value]}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="empty-state">{index.length === 0
          ? "Aucun élément de preuve n’est actuellement publié dans les dossiers."
          : "Aucun élément ne correspond à ces filtres."}</p>
      ) : (
        <div className="evidence-list">
          {filtered.map(({ id, entityName, evidence, source, claims, relation: itemRelation }) => {
            const sourceUrl = safeExternalUrl(source?.url);
            const archiveUrl = safeExternalUrl(source?.archived_url);
            const publishedDate = displayDate(source?.published_at);
            const accessedDate = displayDate(source?.accessed_at);
            return (
              <article className="evidence-card" key={`${entityName}-${id}`}>
                <div className="evidence-card-meta"><span>{entityName}</span><span>{relationLabels[itemRelation]}</span></div>
                <h4>{evidence.summary}</h4>
                <p className="evidence-locator">Repère : {evidence.locator}</p>
                {evidence.excerpt && <blockquote>{evidence.excerpt}</blockquote>}
                {claims.length > 0 && <div className="evidence-linked-claims"><strong>Affirmations liées</strong>
                  <ul>{claims.map((claim) => <li key={claim.id}>{claim.statement}</li>)}</ul></div>}
                {evidence.limitations && <p className="evidence-limitation"><strong>Limites :</strong> {evidence.limitations}</p>}
                <div className="evidence-source">
                  <strong>{source?.title}</strong><span>{source?.publisher}</span>
                  {(publishedDate || accessedDate) && <span className="evidence-source-dates">
                    {publishedDate && `Publication : ${publishedDate}`}{publishedDate && accessedDate && " · "}
                    {accessedDate && `Consultation : ${accessedDate}`}</span>}
                  <div className="evidence-source-links">
                    {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Consulter la source</a>}
                    {archiveUrl && <a href={archiveUrl} target="_blank" rel="noopener noreferrer">Copie d’archive</a>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="comparison-caveat">Un élément de preuve n’est pas une conclusion à lui seul. Consultez le dossier complet pour les autres sources, contradictions et incertitudes.</p>
    </section>
  );
}
