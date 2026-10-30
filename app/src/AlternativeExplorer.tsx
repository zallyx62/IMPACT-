import { useMemo, useState } from "react";
import { getEntityDossier, type EntityRecord } from "./data/records";
import { buildAlternativeIndex } from "./data/public-tool-index";

const statusLabels: Record<string, string> = {
  confirmed: "Relation documentée",
  partial: "Relation partiellement documentée",
};

export default function AlternativeExplorer({
  entities,
  onOpen,
}: {
  entities: EntityRecord[];
  onOpen: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const dossiers = useMemo(() => entities.flatMap((entity) => {
    const dossier = getEntityDossier(entity.id);
    return dossier ? [dossier] : [];
  }), [entities]);
  const alternatives = useMemo(() => buildAlternativeIndex(dossiers), [dossiers]);
  const normalized = query.trim().toLocaleLowerCase("fr");
  const filtered = alternatives.filter((item) =>
    [item.alternativeName, item.targetName, item.relationship.notes, ...item.sourceTitles]
      .filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalized));

  return (
    <section className="public-tool-panel" aria-labelledby="alternative-explorer-title">
      <div className="public-tool-heading">
        <div>
          <h3 id="alternative-explorer-title">Alternatives documentées</h3>
          <p>Des options reliées à une marque ou un produit uniquement lorsque les deux dossiers sont publiés et que la relation possède une source consultable.</p>
        </div>
        <span className="public-tool-count">{filtered.length} / {alternatives.length}</span>
      </div>
      <label className="public-tool-search-label" htmlFor="alternative-search">Rechercher une alternative ou un produit</label>
      <input id="alternative-search" className="public-tool-search" type="search" value={query}
        onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Nom, usage, critère, source…" />
      <p className="comparison-caveat">Une alternative indique une possibilité de remplacement pour un usage donné. Elle n'est pas automatiquement plus écologique, éthique ou responsable : les critères et les limites doivent être lus dans les dossiers.</p>
      {filtered.length === 0 ? <p className="empty-state">{alternatives.length === 0
        ? "Aucune alternative n’est actuellement publiée. IMPACT n’en invente pas : chaque proposition devra relier deux entités publiées et s’appuyer sur une source vérifiable."
        : "Aucune alternative ne correspond à cette recherche."}</p> : (
        <div className="alternative-list">
          {filtered.map((item) => (
            <article className="alternative-card" key={item.id}>
              <div className="alternative-card-heading">
                <div><span className="alternative-eyebrow">Alternative documentée pour</span><h4>{item.targetName}</h4></div>
                <span className="alternative-status">{statusLabels[item.relationship.knowledge_status] ?? item.relationship.knowledge_status}</span>
              </div>
              <p className="alternative-name"><strong>Option :</strong> {item.alternativeName}</p>
              {item.relationship.notes && <p>{item.relationship.notes}</p>}
              {(item.relationship.valid_from || item.relationship.valid_until) && (
                <p className="actor-link-period">Période : {item.relationship.valid_from ?? "début non précisé"} – {item.relationship.valid_until ?? "fin non précisée"}</p>
              )}
              <p className="alternative-sources"><strong>Sources :</strong> {item.sourceTitles.join(" · ")}</p>
              <div className="alternative-actions">
                <button type="button" onClick={() => onOpen(item.alternativeName === "" ? item.relationship.from_entity_id : item.relationship.from_entity_id)}>Voir le dossier de l’alternative</button>
                <button type="button" onClick={() => onOpen(item.relationship.to_entity_id)}>Voir le dossier de référence</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
