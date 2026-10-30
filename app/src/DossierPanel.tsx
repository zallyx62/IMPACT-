import { useEffect, useRef, useState } from "react";
import { getPublishedEntities, type EntityDossier, type Language, type SourceRecord } from "./data/records";
import { safeExternalUrl } from "./data/safe-url";
import { buildDossierShareUrl } from "./data/share-url";

interface Props {
  dossier: EntityDossier;
  language: Language;
  onBack: () => void;
}

const labels = {
  fr: {
    back: "Retour à l’accueil",
    share: "Partager le dossier", copied: "Lien copié", copyFailed: "Copie impossible : utilisez la barre d’adresse.", shareUnavailable: "Partage indisponible sur cet appareil.",
    label: "DOSSIER DOCUMENTÉ",
    reviewed: "Dernière vérification humaine", notReviewed: "Sans validation humaine", evidenceBasis: "Publication fondée sur les preuves", publicationNote: "Périmètre de publication", sourceVerification: "Contrôle documentaire", verifiedOn: "Vérifié le",
    claims: "Affirmations publiées",
    claimAbout: "Concerne",
    noClaims: "Aucune affirmation publiée dans ce dossier.",
    status: "État de l’examen",
    uncertainty: "Limites et incertitudes",
    sources: "Sources", sourceLabel: "Source", entitySources: "Sources de l’entité",
    noSource: "Aucune source associée.",
    evidence: "Éléments de preuve",
    relationships: "Relations documentées",
    campaigns: "Campagnes associées", organizer: "Organisateur", targets: "Entités ciblées",
    responses: "Réponses publiées liées au dossier", respondingEntity: "Entité répondante",
    commitments: "Engagements suivis",
    sourceArchive: "Copie d’archive", sourceAccessed: "Consultée le", sourcePublished: "Publiée le", sourceType: "Nature de la source", sourceLanguage: "Langue", sourceMethodology: "Méthode", sourceConflicts: "Intérêts ou liens pertinents", sourceLicense: "Licence de la source", sourceRights: "Conditions de réutilisation",
    noDescription: "Aucune description éditoriale n’a encore été publiée.",
    type: "Type d’entité", updated: "Mise à jour", announced: "Annoncé le", countries: "Pays concernés", period: "Période concernée", editorialNote: "Note éditoriale", started: "Début", ended: "Fin", received: "Réponse reçue le", published: "Publiée le", fullResponse: "Réponse complète", baseline: "Situation de référence", targetValue: "Valeur cible", demands: "Demandes", outcome: "Résultat rapporté", measurement: "Méthode de mesure", observed: "Résultat observé", publication: "Statut de publication", relationshipStatus: "État de la relation", targetDate: "Échéance",
    statuses: {
      confirmed: "Confirmée",
      corroborated: "Corroborée",
      alleged: "Allégation documentée",
      disputed: "Contestée",
      refuted: "Réfutée",
      insufficient_information: "Informations insuffisantes",
      not_reviewed: "Non examinée",
    } as Record<string, string>,
  },
  en: {
    back: "Back to home",
    share: "Share dossier", copied: "Link copied", copyFailed: "Could not copy: use the address bar.", shareUnavailable: "Sharing is unavailable on this device.",
    label: "DOCUMENTED DOSSIER",
    reviewed: "Last human review", notReviewed: "No human approval", evidenceBasis: "Published under evidence criteria", publicationNote: "Publication scope", sourceVerification: "Documentary check", verifiedOn: "Verified on",
    claims: "Published claims",
    claimAbout: "About",
    noClaims: "No claims have been published in this dossier.",
    status: "Review status",
    uncertainty: "Limitations and uncertainty",
    sources: "Sources", sourceLabel: "Source", entitySources: "Entity sources",
    noSource: "No sources are associated.",
    evidence: "Evidence",
    relationships: "Documented relationships",
    campaigns: "Related campaigns", organizer: "Organizer", targets: "Target entities",
    responses: "Published responses linked to this dossier", respondingEntity: "Responding entity",
    commitments: "Tracked commitments",
    sourceArchive: "Archived copy", sourceAccessed: "Accessed on", sourcePublished: "Published on", sourceType: "Source type", sourceLanguage: "Language", sourceMethodology: "Methodology", sourceConflicts: "Relevant interests or affiliations", sourceLicense: "Source licence", sourceRights: "Reuse conditions",
    noDescription: "No editorial description has been published yet.",
    type: "Entity type", updated: "Last updated", announced: "Announced on", countries: "Countries concerned", period: "Relevant period", editorialNote: "Editorial note", started: "Started", ended: "Ended", received: "Response received", published: "Published on", fullResponse: "Full response", baseline: "Baseline", targetValue: "Target value", demands: "Demands", outcome: "Reported outcome", measurement: "Measurement method", observed: "Observed result", publication: "Publication status", relationshipStatus: "Relationship status", targetDate: "Target date",
    statuses: {
      confirmed: "Confirmed",
      corroborated: "Corroborated",
      alleged: "Documented allegation",
      disputed: "Disputed",
      refuted: "Refuted",
      insufficient_information: "Insufficient information",
      not_reviewed: "Not reviewed",
    } as Record<string, string>,
  },
};

const valueLabels: Record<Language, Record<string, Record<string, string>>> = {
  fr: {
    sourceType: { primary_document: "Document primaire", official_statement: "Déclaration officielle", scientific_study: "Étude scientifique", academic_review: "Revue académique", court_or_regulatory_decision: "Décision judiciaire ou réglementaire", ngo_report: "Rapport associatif", journalism: "Article journalistique", database: "Base de données", other: "Autre" },
    entityType: { organization: "Organisation", brand: "Marque", product: "Produit", service: "Service", association: "Association", institution: "Institution", public_body: "Organisme public" },
    topic: { animals_food: "Animaux et alimentation", environment: "Environnement", human_rights: "Droits humains", business_consumption: "Entreprises et consommation", technology_privacy: "Technologie et vie privée", other: "Autre" },
    relationshipType: { owns: "détient", operates: "exploite", manufactures: "fabrique", distributes: "distribue", supplies: "fournit", certifies: "certifie", funds: "finance", partners_with: "est partenaire de", other: "autre" },
    knowledgeStatus: { confirmed: "Confirmée", partial: "Partielle", disputed: "Contestée", unknown: "Inconnue" },
    campaignStatus: { active: "Active", completed: "Terminée", suspended: "Suspendue", withdrawn: "Retirée", unknown: "Inconnue" },
    publicationStatus: { published: "Publiée", not_published: "Non publiée", withheld: "Non communiquée", unavailable: "Indisponible" },
    commitmentStatus: { announced: "Annoncé", in_progress: "En cours", achieved: "Atteint", not_achieved: "Non atteint", abandoned: "Abandonné", unable_to_assess: "Impossible à évaluer" },
  },
  en: {
    sourceType: { primary_document: "Primary document", official_statement: "Official statement", scientific_study: "Scientific study", academic_review: "Academic review", court_or_regulatory_decision: "Court or regulatory decision", ngo_report: "NGO report", journalism: "Journalism", database: "Database", other: "Other" },
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
  const [shareMessage, setShareMessage] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, [dossier.entity.id]);
  const sourceById = new Map(dossier.sources.map((source) => [source.id, source]));
  const entityById = new Map(getPublishedEntities().map((entity) => [entity.id, entity.name]));
  const entityName = (id: string) => entityById.get(id) ?? id;
  const entityWebsite = safeExternalUrl(dossier.entity.website);

  async function shareDossier() {
    const shareUrl = buildDossierShareUrl(window.location.href, dossier.entity.id);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: `IMPACT — ${dossier.entity.name}`, url: shareUrl });
        setShareMessage("");
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage(t.copied);
        return;
      }
      setShareMessage(t.shareUnavailable);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          setShareMessage(t.copied);
          return;
        }
      } catch { /* Clipboard access can be blocked by the browser. */ }
      setShareMessage(t.shareUnavailable);
    }
  }
  const entitySources = dossier.sources.filter((source) => dossier.entity.source_ids.includes(source.id));
  const sourceReference = (sourceId: string) => {
    const source = sourceById.get(sourceId);
    if (!source) return null;
    const href = safeExternalUrl(source.url);
    const archivedHref = safeExternalUrl(source.archived_url);
    if (!href && !archivedHref) return <span key={source.id}>{source.title}</span>;
    return (
      <span key={source.id}>
        {href
          ? <a href={href} target="_blank" rel="noopener noreferrer">{source.title}</a>
          : <a href={archivedHref} target="_blank" rel="noopener noreferrer">{source.title} ({t.sourceArchive.toLowerCase()})</a>}
        {href && archivedHref && <> · <a href={archivedHref} target="_blank" rel="noopener noreferrer">{t.sourceArchive}</a></>}
      </span>
    );
  };

  const sourceDetails = (source: SourceRecord) => {
    const href = safeExternalUrl(source.url);
    const archivedHref = safeExternalUrl(source.archived_url);
    return (
      <div className="source-reference" key={source.id}>
        {href
          ? <a href={href} target="_blank" rel="noopener noreferrer">{source.title}</a>
          : archivedHref
            ? <a href={archivedHref} target="_blank" rel="noopener noreferrer">{source.title} ({t.sourceArchive.toLowerCase()})</a>
            : <strong>{source.title}</strong>}
        {href && archivedHref && <small><a href={archivedHref} target="_blank" rel="noopener noreferrer">{t.sourceArchive}</a></small>}
        <span>{source.publisher} · {t.sourceType} : {displayValue("sourceType", source.source_type, language)} · {t.sourceAccessed} {dateLabel(source.accessed_at, language)}</span>
        {source.published_at && <small>{t.sourcePublished} : {dateLabel(source.published_at, language)}</small>}
        {source.review_status === "evidence_verified" && <small><strong>{t.sourceVerification} :</strong> {source.verification_note} {source.verified_at && `(${t.verifiedOn} ${dateLabel(source.verified_at, language)})`}</small>}
        {source.language && <small>{t.sourceLanguage} : {source.language.toUpperCase()}</small>}
        {source.methodology && <small><strong>{t.sourceMethodology} :</strong> {source.methodology}</small>}
        {source.potential_conflicts && <small><strong>{t.sourceConflicts} :</strong> {source.potential_conflicts}</small>}
        {source.limitations && <small>{source.limitations}</small>}
        {source.source_license && <small>{t.sourceLicense} : {source.source_license}</small>}
        {source.rights_note && <small>{t.sourceRights} : {source.rights_note}</small>}
      </div>
    );
  };

  return (
    <section className="dossier-panel" aria-labelledby="dossier-title">
      <div className="dossier-actions">
        <button className="back-button" type="button" onClick={onBack}>← {t.back}</button>
        <button className="share-button" type="button" onClick={shareDossier}>{t.share}</button>
        <span className="share-status" role="status" aria-live="polite">{shareMessage}</span>
      </div>
      <header className="dossier-header">
        <p className="section-kicker">{t.label}</p>
        <h2 id="dossier-title" ref={titleRef} tabIndex={-1}>{dossier.entity.name}</h2>
        <p>{dossier.entity.description || t.noDescription}</p>
        <div className="dossier-meta">
          <span>{t.type} : {displayValue("entityType", dossier.entity.entity_type, language)}</span>
          {dossier.entity.country_codes && dossier.entity.country_codes.length > 0 && <span>{t.countries} : {dossier.entity.country_codes.join(", ")}</span>}
          <span>{t.reviewed} : {dossier.entity.reviewed_at ? dateLabel(dossier.entity.reviewed_at, language) : (dossier.entity.publication_basis === "evidence_verified" ? t.evidenceBasis : t.notReviewed)}</span>
          {dossier.entity.publication_basis === "evidence_verified" && dossier.entity.publication_note && <span>{t.publicationNote} : {dossier.entity.publication_note}</span>}{dossier.entity.published_at && <span>{t.published} : {dateLabel(dossier.entity.published_at, language)}</span>}{dossier.entity.updated_at && <span>{t.updated} : {dateLabel(dossier.entity.updated_at, language)}</span>}
        </div>
        {entityWebsite && (
          <a href={entityWebsite} target="_blank" rel="noopener noreferrer">{entityWebsite}</a>
        )}
      </header>

      {entitySources.length > 0 && (
        <section className="dossier-section" aria-labelledby="entity-sources-heading">
          <h3 id="entity-sources-heading">{t.entitySources}</h3>
          <div className="claim-sources">
            {entitySources.map(sourceDetails)}
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
                <p className="claim-reviewed">{t.reviewed} : {claim.reviewed_at ? dateLabel(claim.reviewed_at, language) : (claim.publication_basis === "evidence_verified" ? t.evidenceBasis : t.notReviewed)}</p>
                {claim.publication_basis === "evidence_verified" && claim.publication_note && <p className="claim-reviewed"><strong>{t.publicationNote} :</strong> {claim.publication_note} {claim.published_at && `(${dateLabel(claim.published_at, language)})`}</p>}
                {(claim.valid_from || claim.valid_until) && <p className="claim-reviewed">{t.period} : {claim.valid_from ? dateLabel(claim.valid_from, language) : "…"} – {claim.valid_until ? dateLabel(claim.valid_until, language) : "…"}</p>}
                {claim.editorial_note && <p className="claim-reviewed"><strong>{t.editorialNote} :</strong> {claim.editorial_note}</p>}
                {claim.uncertainty_note && (
                  <p className="claim-uncertainty"><strong>{t.uncertainty} :</strong> {claim.uncertainty_note}</p>
                )}
                <div className="claim-sources">
                  <strong>{t.sources}</strong>
                  {claim.source_ids.map((sourceId) => {
                    const source = sourceById.get(sourceId);
                    return source ? sourceDetails(source) : null;
                  })}
                </div>
                {dossier.evidence.filter((item) => claim.evidence_ids?.includes(item.id) || item.supports_claim_ids?.includes(claim.id) || item.contradicts_claim_ids?.includes(claim.id)).map((item) => (
                  <div className="evidence-reference" key={item.id}>
                    <strong>{t.evidence} · {item.locator}</strong>
                    <p>{item.summary}</p>
                    <div className="extra-sources"><strong>{t.sourceLabel} :</strong> {sourceReference(item.source_id)}</div>
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
            <li key={item.id}><strong>{entityName(item.from_entity_id)} → {displayValue("relationshipType", item.relationship_type, language)} → {entityName(item.to_entity_id)}</strong><span>{t.relationshipStatus} : {displayValue("knowledgeStatus", item.knowledge_status, language)}</span>{(item.valid_from || item.valid_until) && <span>{t.period} : {item.valid_from ? dateLabel(item.valid_from, language) : "…"} – {item.valid_until ? dateLabel(item.valid_until, language) : "…"}</span>}{item.notes && <span>{item.notes}</span>}<div className="extra-sources">{item.source_ids.map(sourceReference)}</div></li>
          ))}</ul>
        </section>
      )}
      {dossier.campaigns.length > 0 && (
        <section className="dossier-section">
          <h3>{t.campaigns}</h3>
          <div className="dossier-list">{dossier.campaigns.map((item) => <article className="claim-card" key={item.id}><strong>{item.title}</strong><p>{displayValue("campaignStatus", item.campaign_status, language)}</p>{(item.started_at || item.ended_at) && <p>{t.started} : {item.started_at ? dateLabel(item.started_at, language) : "…"} · {t.ended} : {item.ended_at ? dateLabel(item.ended_at, language) : "…"}</p>}{item.organizer_entity_id && <p><strong>{t.organizer} :</strong> {entityName(item.organizer_entity_id)}</p>}<p><strong>{t.targets} :</strong> {item.target_entity_ids.map(entityName).join(", ")}</p><strong>{t.demands}</strong><ul>{item.demands.map((demand) => <li key={demand}>{demand}</li>)}</ul>{item.outcome_summary && <p>{t.outcome} : {item.outcome_summary}</p>}<div className="extra-sources">{item.source_ids.map(sourceReference)}</div></article>)}</div>
        </section>
      )}
      {dossier.responses.length > 0 && (
        <section className="dossier-section">
          <h3>{t.responses}</h3>
          <div className="dossier-list">{dossier.responses.map((item) => <article className="claim-card" key={item.id}>{item.entity_id !== dossier.entity.id && <p><strong>{t.respondingEntity} :</strong> {entityName(item.entity_id)}</p>}<p>{item.summary}</p><p>{t.publication} : {displayValue("publicationStatus", item.publication_status, language)}</p>{item.received_at && <p>{t.received} : {dateLabel(item.received_at, language)}</p>}{item.published_at && <p>{t.published} : {dateLabel(item.published_at, language)}</p>}{item.full_response_url && safeExternalUrl(item.full_response_url) && <p><a href={safeExternalUrl(item.full_response_url)} target="_blank" rel="noopener noreferrer">{t.fullResponse}</a></p>}{item.source_id && <div className="extra-sources">{sourceReference(item.source_id)}</div>}</article>)}</div>
        </section>
      )}
      {dossier.commitments.length > 0 && (
        <section className="dossier-section">
          <h3>{t.commitments}</h3>
          <div className="dossier-list">{dossier.commitments.map((item) => <article className="claim-card" key={item.id}><p className="claim-statement">{item.statement}</p><p>{displayValue("commitmentStatus", item.status, language)} · {t.announced} : {dateLabel(item.announced_at, language)}{item.target_date ? ` · ${t.targetDate} : ${dateLabel(item.target_date, language)}` : ""}</p>{item.baseline && <p><strong>{t.baseline} :</strong> {item.baseline}</p>}{item.target_value && <p><strong>{t.targetValue} :</strong> {item.target_value}</p>}{item.measurement_method && <p><strong>{t.measurement} :</strong> {item.measurement_method}</p>}{item.observed_result && <p><strong>{t.observed} :</strong> {item.observed_result}</p>}<div className="extra-sources">{item.source_ids.map(sourceReference)}</div></article>)}</div>
        </section>
      )}
    </section>
  );
}
