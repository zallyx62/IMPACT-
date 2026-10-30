import { useMemo } from "react";
import { getEntityDossier, type EntityRecord } from "./data/records";
import { dossiersForUniverse } from "./data/universe-index";

export default function UniverseExplorer({ universeId, entities, onOpen }: {
  universeId: string;
  entities: EntityRecord[];
  onOpen: (id: string) => void;
}) {
  const dossiers = useMemo(() => entities.flatMap((entity) => {
    const dossier = getEntityDossier(entity.id);
    return dossier ? [dossier] : [];
  }), [entities]);
  const matching = useMemo(() => dossiersForUniverse(universeId, dossiers), [universeId, dossiers]);
  return (
    <section className="universe-explorer" aria-labelledby="universe-explorer-title">
      <div className="universe-explorer-heading">
        <h3 id="universe-explorer-title">Dossiers publiés dans cet univers</h3>
        <span>{matching.length} dossier{matching.length > 1 ? "s" : ""}</span>
      </div>
      {matching.length === 0 ? (
        <div className="preparation-note">
          <span className="note-dot" aria-hidden="true" />
          <div><strong>Aucun dossier publié dans cet univers pour le moment</strong>
            <p>Les contenus apparaîtront ici lorsqu’ils auront satisfait aux critères de publication. Aucun contenu non vérifié n’est affiché pour remplir la rubrique.</p></div>
        </div>
      ) : (
        <div className="universe-dossier-list">
          {matching.map((dossier) => (
            <button className="universe-dossier-item" key={dossier.entity.id} type="button" onClick={() => onOpen(dossier.entity.id)}>
              <span className="universe-dossier-main"><strong>{dossier.entity.name}</strong>
                <span>{dossier.entity.description || "Dossier documenté"}</span></span>
              <span className="universe-dossier-metrics">
                <span>{dossier.claims.length} affirmation{dossier.claims.length > 1 ? "s" : ""}</span>
                <span>{dossier.sources.length} source{dossier.sources.length > 1 ? "s" : ""}</span>
                <span>{dossier.evidence.length} preuve{dossier.evidence.length > 1 ? "s" : ""}</span>
                {dossier.campaigns.length > 0 && <span>{dossier.campaigns.length} campagne{dossier.campaigns.length > 1 ? "s" : ""}</span>}
              </span>
              <span className="universe-dossier-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
