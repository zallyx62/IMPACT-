import { useState } from "react";
import { buildSolutionPlan } from "./data/solution-plan";

export default function SolutionWorkshop() {
  const [objective, setObjective] = useState("");
  const [context, setContext] = useState("");
  const [resources, setResources] = useState("");
  const [constraints, setConstraints] = useState("");
  const [indicator, setIndicator] = useState("");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setPlan(buildSolutionPlan({ objective, context, resources, constraints, indicator }));
      setError("");
    } catch (caught) {
      setPlan("");
      setError(caught instanceof Error ? caught.message : "Impossible de préparer la fiche.");
    }
  }

  return (
    <section className="solution-workshop" aria-labelledby="solution-workshop-title">
      <div className="solution-workshop-heading">
        <div>
          <h3 id="solution-workshop-title">Transformer une idée en projet vérifiable</h3>
          <p>Préparez un plan structuré, sans compte, sans transmission et sans publication automatique. Les champs restent dans cette page : exportez le résultat avant de la fermer.</p>
        </div>
        <span className="solution-local-label">Local uniquement</span>
      </div>
      <form className="solution-form" onSubmit={prepare}>
        <label htmlFor="solution-objective">Quel problème voulez-vous résoudre ?</label>
        <textarea id="solution-objective" value={objective} onChange={(event) => setObjective(event.currentTarget.value)}
          minLength={12} required rows={3} placeholder="Décrivez le problème et le changement recherché…" />
        <label htmlFor="solution-context">Contexte et éléments déjà connus</label>
        <textarea id="solution-context" value={context} onChange={(event) => setContext(event.currentTarget.value)}
          rows={2} placeholder="Lieu, personnes concernées, sources disponibles, situation de départ…" />
        <label htmlFor="solution-resources">Ressources et compétences disponibles</label>
        <textarea id="solution-resources" value={resources} onChange={(event) => setResources(event.currentTarget.value)}
          rows={2} placeholder="Bénévoles, matériel, lieux, savoir-faire, ressources réutilisables…" />
        <label htmlFor="solution-constraints">Contraintes, risques et précautions</label>
        <textarea id="solution-constraints" value={constraints} onChange={(event) => setConstraints(event.currentTarget.value)}
          rows={2} placeholder="Sécurité, autorisations, budget éventuel, limites, effets indésirables…" />
        <label htmlFor="solution-indicator">Comment mesurer le résultat ?</label>
        <textarea id="solution-indicator" value={indicator} onChange={(event) => setIndicator(event.currentTarget.value)}
          rows={2} placeholder="Indicateur, valeur de départ, méthode et date de mesure…" />
        <button className="solution-prepare" type="submit">Préparer la fiche projet</button>
      </form>
      {error && <p className="solution-error" role="alert">{error}</p>}
      {plan && (
        <div className="solution-output">
          <label htmlFor="solution-plan-output">Fiche de projet à copier ou enregistrer</label>
          <textarea id="solution-plan-output" value={plan} readOnly rows={18} onFocus={(event) => event.currentTarget.select()} />
          <p className="solution-status" role="status">Fiche préparée sur cet appareil. Rien n’a été envoyé ni publié.</p>
        </div>
      )}
    </section>
  );
}
