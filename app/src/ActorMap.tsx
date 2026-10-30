import { useMemo, useState } from "react";
import { getEntityDossier, type EntityRecord } from "./data/records";
import { buildActorIndex } from "./data/public-tool-index";

const labels: Record<string, string> = {
  owns: "Détient", operates: "Exploite", manufactures: "Fabrique", distributes: "Distribue", alternative_to: "Est une alternative à",
  supplies: "Fournit", certifies: "Certifie", funds: "Finance", partners_with: "Partenaire de", other: "Autre relation",
  confirmed: "Confirmée", partial: "Partielle", disputed: "Contestée", unknown: "Inconnue",
};

export default function ActorMap({ entities }: { entities: EntityRecord[] }) {
  const [query, setQuery] = useState("");
  const dossiers = useMemo(() => entities.flatMap((entity) => {
    const dossier = getEntityDossier(entity.id);
    return dossier ? [dossier] : [];
  }), [entities]);
  const links = useMemo(() => buildActorIndex(dossiers), [dossiers]);
  const normalized = query.trim().toLocaleLowerCase("fr");
  const filtered = links.filter((item) =>
    [item.fromName, item.toName, item.relationship.relationship_type, item.relationship.notes, ...item.sourceTitles]
      .filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalized));
  return (
    <section className="public-tool-panel" aria-labelledby="actor-map-title">
      <div className="public-tool-heading">
        <div><h3 id="actor-map-title">Relations documentées entre acteurs</h3>
          <p>Chaque lien affiché est issu d’un dossier publié et possède au moins une source admissible. Les liens ne signifient pas tous une relation de propriété.</p></div>
        <span className="public-tool-count">{filtered.length} / {links.length}</span>
      </div>
      <label className="public-tool-search-label" htmlFor="actor-map-search">Rechercher un acteur ou une relation</label>
      <input id="actor-map-search" className="public-tool-search" type="search" value={query}
        onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Nom, type de relation, source…" />
      {filtered.length === 0 ? <p className="empty-state">{links.length === 0
        ? "Aucune relation entre deux entités publiées n’est actuellement documentée."
        : "Aucune relation ne correspond à cette recherche."}</p> : (
        <div className="actor-link-list">
          {filtered.map(({ id, fromName, toName, relationship, sourceTitles }) => (
            <article className="actor-link-card" key={id}>
              <div className="actor-link-names"><strong>{fromName}</strong><span aria-hidden="true">→</span><strong>{toName}</strong></div>
              <p><b>{labels[relationship.relationship_type] ?? relationship.relationship_type.replaceAll("_", " ")}</b>
                {" · "}{labels[relationship.knowledge_status] ?? relationship.knowledge_status}</p>
              {(relationship.valid_from || relationship.valid_until) && <p className="actor-link-period">
                Période : {relationship.valid_from ?? "début non précisé"} – {relationship.valid_until ?? "en cours ou fin non précisée"}</p>}
              {relationship.notes && <p>{relationship.notes}</p>}
              {sourceTitles.length > 0 && <p className="actor-link-sources"><strong>Sources :</strong> {sourceTitles.join(" · ")}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
