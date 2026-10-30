import { getPublishedEntities, type EntityDossier, type Language } from "./data/records";
import { safeExternalUrl } from "./data/safe-url";

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
    claimAbout: "Concerne",
    noClaims: "Aucune affirmation publiée dans ce dossier.",
    status: "État de l’examen",
    uncertainty: "Limites et incertitudes",
    sources: "Sources", entitySources: "Sources de l’entité",
    noSource: "Aucune source associée.",
    evidence: "Éléments de preuve",
    relationships: "Relations documentées",
    campaigns: "Campagnes associées", organizer: "Organisateur", targets: "Entités ciblées",
    responses: "Réponses de l’entité",
    commitments: "Engagements suivis",
    sourceAccessed: "Consultée le", sourceLicense: "Licence de la source", sourceRights: "Conditions de réutilisation",
    noDescription: "Aucune description éditoriale n’a encore été publiée.",
    type: "Type d’entité", demands: "Demandes", outcome: "Résultat rapporté", measurement: "Méthode de mesure", observed: "Résultat observé", publication: "Statut de publication", relationshipStatus: "État de la relation", targetDate: "Échéance",
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
    claimAbout: "About",
    noClaims: "No claims have been published in this dossier.",
    status: "Review status",
    uncertainty: "Limitations and uncertainty",
    sources: "Sources", entitySources: "Entity sources",
    noSource: "No sources are associated.",
    evidence: "Evidence",
    relationships: "Documented relationships",
    campaigns: "Related campaigns", organizer: "Organizer", targets: "Target entities",
    responses: "Entity responses",
    commitments: "Tracked commitments",
    sourceAccessed: "Accessed on", sourceLicense: "Source licence", sourceRights: "Reuse conditions",
    noDescription: "No editorial description has been published yet.",
    type: "Entity type", demands: "Demands", outcome: "Reported outcome", measurement: "Measurement method", observed: "Observed result", publication: "Publication status", relationshipStatus: "Relationship status", targetDate: "Target date",
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

const valueLabels: Record<Language, Record<string, Record<string, string>>> = {
  fr: {
    entityType: { organization: "Organisation", brand: "Marque", product: "Produit", service: "Service", association: "Association", institution: "Institution", public_body: "Organisme public" },
    topic: { animals_food: "Animaux et alimentation", environment: "Environnement", human_rights: "Droits humains", business_consumption: "Entreprises et consommation", technology_privacy: "Technologie et vie privée", other: "Autre" },
    relationshipType: { owns: "détient", operates: "exploite", manufactures: "fabrique", distributes: "distribue", supplies: "fournit", certifies: "certifie", funds: "finance", partners_with: "est partenaire de", other: "autre" },
    knowledgeStatus: { confirmed: "Confirmée", partial: "Partielle", disputed: "Contestée", unknown: "Inconnue" },
    campaignStatus: { active: "Active", completed: "Terminée", suspended: "Suspendue", withdrawn: "Retirée", unknown: "Inconnue" },
    publicationStatus: { published: "Publiée", not_published: "Non publiée", withheld: "Non communiquée", unavailable: "Indisponible" },
    commitmentStatus: { announced: "Annoncé", in_progress: "En cours", achieved: "Atteint", not_achieved: "Non atteint", abandoned: "Abandonné", unable_to_assess: "Impossible à évaluer" },
  },
  en: {
    entityType: { organization: "Organization", brand: "Brand", product: "Product", service: "Service", association: "Association", institution: "Institution", public_body: "Public body" },
    topic: { animals_food: "Animals and food", environment: "Environment", human_rights: "Human rights", business_consumption: "Business and consumption", technology_privacy: "Technology and privacy", other: "Other" },
    relationshipType: { owns: "owns", operates: "operates", manufactures: "manufactures", distributes: "distributes", supplies: "supplies", certifies: "certifies", funds: "funds", partners_with: "partners with", other: "other" },
    knowledgeStatus: { confirmed: "Confirmed", partial: "Partial", disputed: "Disputed", unknown: "Unknown" },
    campaignStatus: { active: "Active", completed: "Completed", suspended: "Suspended", withdrawn: "Withdrawn", unknown: "Unknown" },
    publicationStatus: { published: "Published", not_published: "Not published", withheld: "Withheld", unavailable: "Unavailable" },
    commitmentStatus: { announced: "Announced", in_progress: "In progress", achieved: "Achieved", not_achieved: "Not achieved", abandoned: "Abandoned", unable_to_assess: "Unable to assess" },
  },
};

function displayValue(group: string, value: string, language: Language): string {
  return valueLabels[language][group]?.[value] ?? value.replaceAll("_", " ");
}

function dateLabel(value: string, language: Language) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", { dateStyle: "medium" }).format(date);
}

export default function DossierPanel({ dossier, language, onBack }: Props) {
  const t = labels[language];
  const sourceById = new Map(dossier.sources.map((source) => [source.id, source]));
  const entityById = new Map(getPublishedEntities().map((entity) => [entity.id, entity.name]));
  const entityName = (id: string) => entityById.get(id) ?? id;
  const entityWebsite = safeExternalUrl(dossier.entity.website);
  const entitySources = dossier.sources.filter((source) => dossier.entity.source_ids.includes(source.id));
  const sourceReference = (sourceId: string) => {
    const source = sourceById.get(sourceId);
    if (!source) return null;
    const href = safeExternalUrl(source.url);
    return href
      ? <a key={source.id} href={href} target="_blank" rel="noopener noreferrer">{source.title}</a>
      : <span key={source.id}>{source.title}</span>;
  };

  return (
    <section className="dossier-panel" aria-labelledby="dossier-title">
      <button className="back-button" type="button" onClick={onBack}>← {t.back}</button>
      <header className="dossier-header">
        <p className="section-kicker">{t.label}</p>
        <h2 id="dossier-title">{dossier.entity.name}</h2>
        <p>{dossier.entity.description || t.noDescription}</p>
        <div className="dossier-meta">
          <span>{t.type} : {displayValue("entityType", dossier.entity.entity_type, language)}</span>
          <span>{t.reviewed} : {dateLabel(dossier.entity.reviewed_at, language)}</span>
        </div>
        {entityWebsite && (
          <a href={entityWebsite} target="_blank" rel="noopener noreferrer">{entityWebsite}</a>
        )}
      </header>

      {entitySources.length > 0 && (
        <section className="dossier-section" aria-labelledby="entity-sources-heading">
          <h3 id="entity-sources-heading">{t.entitySources}</h3>
          <div className="claim-sources">
            {entitySources.map((source) => {
              const href = safeExternalUrl(source.url);
              return (
                <div className="source-reference" key={source.id}>
                  {href
                    ? <a href={href} target="_blank" rel="noopener noreferrer">{source.title}</a>
                    : <strong>{source.title}</strong>}
                  <span>{source.publisher} · {t.sourceAccessed} {dateLabel(source.accessed_at, language)}</span>
                  {source.limitations && <small>{source.limitations}</small>}
                  {source.source_license && <small>{t.sourceLicense} : {source.source_license}</small>}
                  {source.rights_note && <small>{t.sourceRights} : {source.rights_note}</small>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="dossier-section" aria-labelledby="claims-heading">
        <h3 id="claims-heading">{t.claims}</h3>
        {dossier.claims.length === 0 ? <p className="empty-state">{t.noClaims}</p> : (
          <div className="dossier-list">
            {dossier.claims.map((claim) => (
              <article className="claim-card" key={claim.id}>
                <div className="claim-card-heading">
                  <span className="claim-topic">{displayValue("topic", claim.topic, language)}</span>
                  <span className="claim-status">{t.statuses[claim.claim_status] ?? claim.claim_status}</span>
                </div>
                {claim.subject_entity_id !== dossier.entity.id && (
                  <p className="claim-reviewed"><strong>{t.claimAbout} :</strong> {entityName(claim.subject_entity_id)}</p>
                )}
                <p className="claim-statement">{claim.statement}</p>
                <p className="claim-reviewed">{t.reviewed} : {dateLabel(claim.reviewed_at, language)}</p>
                {claim.uncertainty_note && (
                  <p className="claim-uncertainty"><strong>{t.uncertainty} :</strong> {claim.uncertainty_note}</p>
                )}
                <div className="claim-sources">
                  <strong>{t.sources}</strong>
                  {claim.source_ids.map((sourceId) => {
                    const source = sourceById.get(sourceId);
                    if (!source) return null;
                    const href = safeExternalUrl(source.url);
                    return (
                      <div className="source-reference" key={source.id}>
                        {href
                          ? <a href={href} target="_blank" rel="noopener noreferrer">{source.title}</a>
                          : <span>{source.title}</span>}
                        <span>{source.publisher} · {t.sourceAccessed} {dateLabel(source.accessed_at, language)}</span>
                        {source.limitations && <small>{source.limitations}</small>}
                        {source.source_license && <small>{t.sourceLicense} : {source.source_license}</small>}
                        {source.rights_note && <small>{t.sourceRights} : {source.rights_note}</small>}
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
            <li key={item.id}><strong>{entityName(item.from_entity_id)} → {displayValue("relationshipType", item.relationship_type, language)} → {entityName(item.to_entity_id)}</strong><span>{t.relationshipStatus} : {displayValue("knowledgeStatus", item.knowledge_status, language)}</span><div className="extra-sources">{item.source_ids.map(sourceReference)}</div></li>
          ))}</ul>
        </section>
      )}
      {dossier.campaigns.length > 0 && (
        <section className="dossier-section">
          <h3>{t.campaigns}</h3>
          <div className="dossier-list">{dossier.campaigns.map((item) => <article className="claim-card" key={item.id}><strong>{item.title}</strong><p>{displayValue("campaignStatus", item.campaign_status, language)}</p>{item.organizer_entity_id && <p><strong>{t.organizer} :</strong> {entityName(item.organizer_entity_id)}</p>}<p><strong>{t.targets} :</strong> {item.target_entity_ids.map(entityName).join(", ")}</p><strong>{t.demands}</strong><ul>{item.demands.map((demand) => <li key={demand}>{demand}</li>)}</ul>{item.outcome_summary && <p>{t.outcome} : {item.outcome_summary}</p>}<div className="extra-sources">{item.source_ids.map(sourceReference)}</div></article>)}</div>
        </section>
      )}
      {dossier.responses.length > 0 && (
        <section className="dossier-section">
          <h3>{t.responses}</h3>
          <div className="dossier-list">{dossier.responses.map((item) => <article className="claim-card" key={item.id}><p>{item.summary}</p><p>{t.publication} : {displayValue("publicationStatus", item.publication_status, language)}</p>{item.source_id && <div className="extra-sources">{sourceReference(item.source_id)}</div>}</article>)}</div>
        </section>
      )}
      {dossier.commitments.length > 0 && (
        <section className="dossier-section">
          <h3>{t.commitments}</h3>
          <div className="dossier-list">{dossier.commitments.map((item) => <article className="claim-card" key={item.id}><p className="claim-statement">{item.statement}</p><p>{displayValue("commitmentStatus", item.status, language)}{item.target_date ? ` · ${t.targetDate} : ${dateLabel(item.target_date, language)}` : ""}</p>{item.measurement_method && <p><strong>{t.measurement} :</strong> {item.measurement_method}</p>}{item.observed_result && <p><strong>{t.observed} :</strong> {item.observed_result}</p>}<div className="extra-sources">{item.source_ids.map(sourceReference)}</div></article>)}</div>
        </section>
      )}
    </section>
  );
}
