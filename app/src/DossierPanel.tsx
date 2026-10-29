import type { EntityDossier, Language } from "./data/records";

interface Props {
  dossier: EntityDossier;
  language: Language;
  onBack: () => void;
}

const labels = {
  fr: {
    back: "Retour à l’accueil",
    label: "DOSSIER DOCUMENTÉ",
    reviewed: "Dernière vérification",
    claims: "Affirmations examinées",
    noClaims: "Aucune affirmation publiée dans ce dossier.",
    status: "État de l’examen",
    uncertainty: "Limites et incertitudes",
    sources: "Sources",
    noSource: "Aucune source associée.",
    evidence: "Éléments de preuve",
    relationships: "Relations documentées",
    campaigns: "Campagnes associées",
    responses: "Réponses de l’entité",
    commitments: "Engagements suivis",
    sourceAccessed: "Consultée le",
    noDescription: "Aucune description éditoriale n’a encore été publiée.",
    type: "Type d’entité",
    statuses: {
      confirmed: "Confirmée",
      corroborated: "Corroborée",
      alleged: "Allégation documentée",
      disputed: "Contestée",
      refuted: "Réfutée",
      insufficient_information: "Informations insuffisantes",
    } as Record<string, string>,
  },
  en: {
    back: "Back to home",
    label: "DOCUMENTED DOSSIER",
    reviewed: "Last reviewed",
    claims: "Reviewed claims",
    noClaims: "No claims have been published in this dossier.",
    status: "Review status",
    uncertainty: "Limitations and uncertainty",
    sources: "Sources",
    noSource: "No sources are associated.",
    evidence: "Evidence",
    relationships: "Documented relationships",
    campaigns: "Related campaigns",
    responses: "Entity responses",
    commitments: "Tracked commitments",
    sourceAccessed: "Accessed on",
    noDescription: "No editorial description has been published yet.",
    type: "Entity type",
    statuses: {
      confirmed: "Confirmed",
      corroborated: "Corroborated",
      alleged: "Documented allegation",
      disputed: "Disputed",
      refuted: "Refuted",
      insufficient_information: "Insufficient information",
    } as Record<string, string>,
  },
};

function dateLabel(value: string, language: Language) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", { dateStyle: "medium" }).format(date);
}

export default function DossierPanel({ dossier, language, onBack }: Props) {
  const t = labels[language];
  const sourceById = new Map(dossier.sources.map((source) => [source.id, source]));
  const entityName = (id: string) => id;

  return (
    <section className="dossier-panel" aria-labelledby="dossier-title">
      <button className="back-button" type="button" onClick={onBack}>← {t.back}</button>
      <header className="dossier-header">
        <p className="section-kicker">{t.label}</p>
        <h2 id="dossier-title">{dossier.entity.name}</h2>
        <p>{dossier.entity.description || t.noDescription}</p>
        <div className="dossier-meta">
          <span>{t.type} : {dossier.entity.entity_type}</span>
          <span>{t.reviewed} : {dateLabel(dossier.entity.reviewed_at, language)}</span>
        </div>
        {dossier.entity.website && (
          <a href={dossier.entity.website} target="_blank" rel="noreferrer">{dossier.entity.website}</a>
        )}
      </header>

      <section className="dossier-section" aria-labelledby="claims-heading">
        <h3 id="claims-heading">{t.claims}</h3>
        {dossier.claims.length === 0 ? <p className="empty-state">{t.noClaims}</p> : (
          <div className="dossier-list">
            {dossier.claims.map((claim) => (
              <article className="claim-card" key={claim.id}>
                <div className="claim-card-heading">
                  <span className="claim-topic">{claim.topic.replaceAll("_", " ")}</span>
                  <span className="claim-status">{t.statuses[claim.claim_status] ?? claim.claim_status}</span>
                </div>
                <p className="claim-statement">{claim.statement}</p>
                <p className="claim-reviewed">{t.reviewed} : {dateLabel(claim.reviewed_at, language)}</p>
                {claim.uncertainty_note && (
                  <p className="claim-uncertainty"><strong>{t.uncertainty} :</strong> {claim.uncertainty_note}</p>
                )}
                <div className="claim-sources">
                  <strong>{t.sources}</strong>
                  {claim.source_ids.map((sourceId) => {
                    const source = sourceById.get(sourceId);
                    if (!source) return <span key={sourceId}>{sourceId}</span>;
                    return (
                      <div className="source-reference" key={source.id}>
                        {source.url
                          ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                          : <span>{source.title}</span>}
                        <span>{source.publisher} · {t.sourceAccessed} {dateLabel(source.accessed_at, language)}</span>
                        {source.limitations && <small>{source.limitations}</small>}
                      </div>
                    );
                  })}
                </div>
                {dossier.evidence.filter((item) => claim.evidence_ids?.includes(item.id) || item.supports_claim_ids?.includes(claim.id) || item.contradicts_claim_ids?.includes(claim.id)).map((item) => (
                  <div className="evidence-reference" key={item.id}>
                    <strong>{t.evidence} · {item.locator}</strong>
                    <p>{item.summary}</p>
                    {item.limitations && <small>{item.limitations}</small>}
                  </div>
                ))}
              </article>
            ))}
          </div>
        )}
      </section>

      {dossier.relationships.length > 0 && (
        <section className="dossier-section">
          <h3>{t.relationships}</h3>
          <ul>{dossier.relationships.map((item) => (
            <li key={item.id}>{entityName(item.from_entity_id)} → {item.relationship_type.replaceAll("_", " ")} → {entityName(item.to_entity_id)}</li>
          ))}</ul>
        </section>
      )}
      {dossier.campaigns.length > 0 && (
        <section className="dossier-section">
          <h3>{t.campaigns}</h3>
          <ul>{dossier.campaigns.map((item) => <li key={item.id}>{item.title} — {item.campaign_status}</li>)}</ul>
        </section>
      )}
      {dossier.responses.length > 0 && (
        <section className="dossier-section">
          <h3>{t.responses}</h3>
          <ul>{dossier.responses.map((item) => <li key={item.id}>{item.summary}</li>)}</ul>
        </section>
      )}
      {dossier.commitments.length > 0 && (
        <section className="dossier-section">
          <h3>{t.commitments}</h3>
          <ul>{dossier.commitments.map((item) => <li key={item.id}>{item.statement} — {item.status}</li>)}</ul>
        </section>
      )}
    </section>
  );
}
