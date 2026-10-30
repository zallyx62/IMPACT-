import { useMemo, useState } from "react";
import { getEntityDossier, type EntityRecord } from "./data/records";
import { buildEvidenceIndex, type EvidenceRelation } from "./data/evidence-index";
import { safeExternalUrl } from "./data/safe-url";

const relationLabels: Record<EvidenceRelation, string> = {
  supports: "Élément allant dans le sens de l’affirmation",
  contradicts: "Élément contradictoire ou nuançant",
  mixed: "Élément à la fois favorable et contradictoire",
  context: "Élément associé — portée non déterminée",
};

export default function EvidenceCentre({ entities }: { entities: EntityRecord[] }) {
  const [query, setQuery] = useState("");
  const index = useMemo(
    () => buildEvidenceIndex(entities.flatMap((entity) => {
      const dossier = getEntityDossier(entity.id);
      return dossier ? [dossier] : [];
    })),
    [entities],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const filtered = normalizedQuery
    ? index.filter(({ entityName, evidence, source, claims }) =>
        [entityName, evidence.summary, evidence.locator, evidence.excerpt, evidence.limitations,
          source?.title, source?.publisher, ...claims.map((claim) => claim.statement)]
          .filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalizedQuery))
    : index;

  return (
    <section className="evidence-centre" aria-labelledby="evidence-centre-title">
      <div className="evidence-centre-heading">
        <div>
          <h3 id="evidence-centre-title">Éléments de preuve publiés</h3>
          <p>Cette vue rassemble uniquement les éléments déjà présents dans des dossiers publiés. Chaque élément reste lié à sa source et à son périmètre.</p>
        </div>
        <span className="evidence-count" aria-label={`${filtered.length} éléments affichés sur ${index.length}`}>
          {filtered.length} / {index.length}
        </span>
      </div>
      <label className="evidence-search-label" htmlFor="evidence-centre-search">Rechercher dans les preuves</label>
      <input
        id="evidence-centre-search"
        className="evidence-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder="Entreprise, affirmation, source, mot-clé…"
        autoComplete="off"
      />
      {filtered.length === 0 ? (
        <p className="empty-state">{index.length === 0
          ? "Aucun élément de preuve n’est actuellement publié dans les dossiers."
          : "Aucun élément ne correspond à cette recherche."}</p>
      ) : (
        <div className="evidence-list">
          {filtered.map(({ id, entityName, evidence, source, claims, relation }) => {
            const sourceUrl = safeExternalUrl(source?.url);
            const archiveUrl = safeExternalUrl(source?.archived_url);
            return (
              <article className="evidence-card" key={`${entityName}-${id}`}>
                <div className="evidence-card-meta">
                  <span>{entityName}</span>
                  <span>{relationLabels[relation]}</span>
                </div>
                <h4>{evidence.summary}</h4>
                <p className="evidence-locator">Repère : {evidence.locator}</p>
                {evidence.excerpt && <blockquote>{evidence.excerpt}</blockquote>}
                {claims.length > 0 && (
                  <div className="evidence-linked-claims">
                    <strong>Affirmations liées</strong>
                    <ul>{claims.map((claim) => <li key={claim.id}>{claim.statement}</li>)}</ul>
                  </div>
                )}
                {evidence.limitations && <p className="evidence-limitation"><strong>Limites :</strong> {evidence.limitations}</p>}
                <div className="evidence-source">
                  <strong>{source?.title}</strong>
                  <span>{source?.publisher}</span>
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
      <p className="comparison-caveat">Un élément de preuve n’est pas une conclusion à lui seul. Consultez le dossier complet pour les autres sources, les contradictions et les incertitudes.</p>
    </section>
  );
}
