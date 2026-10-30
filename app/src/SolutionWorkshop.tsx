import { useMemo, useState, type FormEvent } from "react";
import { buildSolutionPlan } from "./data/solution-plan";
import { searchSolutionMethods } from "./data/solution-library";
import { projectMarkdownFilename } from "./data/solution-export";

export default function SolutionWorkshop() {
  const [objective, setObjective] = useState("");
  const [context, setContext] = useState("");
  const [resources, setResources] = useState("");
  const [constraints, setConstraints] = useState("");
  const [indicator, setIndicator] = useState("");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [methodQuery, setMethodQuery] = useState("");
  const methods = useMemo(() => searchSolutionMethods(methodQuery), [methodQuery]);

  function downloadPlan() {
    if (!plan) return;
    const blob = new Blob([plan], { type: "text/markdown;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = projectMarkdownFilename(objective);
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
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
          <p>Préparez un plan structuré, sans compte, sans transmission et sans publication automatique. Les champs restent dans cette page : copiez ou téléchargez la fiche pour la conserver.</p>
        </div>
        <span className="solution-local-label">Local uniquement</span>
      </div>

      <section className="solution-library" aria-labelledby="solution-library-title">
        <div className="solution-library-heading">
          <div>
            <h4 id="solution-library-title">Bibliothèque de méthodes réutilisables</h4>
            <p>Des canevas de travail pour diagnostiquer, expérimenter et évaluer. Ce sont des méthodes génériques, pas des interventions dont l'efficacité aurait été démontrée.</p>
          </div>
          <span>{methods.length} / 3</span>
        </div>
        <label className="solution-library-search-label" htmlFor="solution-method-search">Rechercher une méthode</label>
        <input id="solution-method-search" className="solution-library-search" type="search" value={methodQuery}
          onChange={(event) => setMethodQuery(event.currentTarget.value)} placeholder="Diagnostic, expérimentation, indicateur…" />
        {methods.length === 0 ? <p className="solution-library-empty">Aucune méthode ne correspond à cette recherche.</p> : (
          <div className="solution-method-list">
            {methods.map((method) => (
              <details className="solution-method" key={method.id}>
                <summary><strong>{method.title}</strong><span>{method.description}</span></summary>
                <div className="solution-method-content">
                  <h5>Quand l'utiliser</h5>
                  <p>{method.whenToUse}</p>
                  <h5>Étapes proposées</h5>
                  <ol>{method.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  <h5>Exemples d'indicateurs</h5>
                  <ul>{method.indicatorExamples.map((item) => <li key={item}>{item}</li>)}</ul>
                  <h5>Points de vigilance</h5>
                  <ul>{method.watchPoints.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

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
          <label htmlFor="solution-plan-output">Fiche de projet à copier ou télécharger</label>
          <textarea id="solution-plan-output" value={plan} readOnly rows={18} onFocus={(event) => event.currentTarget.select()} />
          <div className="solution-output-actions">
            <button className="solution-download" type="button" onClick={downloadPlan}>Télécharger la fiche (.md)</button>
            <p className="solution-status" role="status">Fiche préparée sur cet appareil. Le téléchargement est local : rien n’a été envoyé ni publié.</p>
          </div>
        </div>
      )}
    </section>
  );
}
