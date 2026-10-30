import { useEffect, useMemo, useState } from "react";
import { tools, universes, type CatalogItem, type Language } from "./data/catalog";
import { matchesSearch, normalizeSearch, searchableEntityText, searchableText } from "./data/search";
import { getEntityDossier, getPublishedEntities, type EntityRecord } from "./data/records";
import { getComparisonMetrics } from "./data/comparison-metrics";
import DossierPanel from "./DossierPanel";
import EvidenceCentre from "./EvidenceCentre";
import { parseSelectionHash, type Selection } from "./data/hash-route";

type Theme = "light" | "dark";
type Accent = "green" | "blue" | "violet" | "orange" | "rose";
const accentColors: Record<Accent, string> = {
  green: "#176b52", blue: "#2866b2", violet: "#7651b5", orange: "#9f4f16", rose: "#9a3d5a",
};

function getInitialTheme(): Theme {
  try {
    return window.localStorage.getItem("impact-theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function getInitialAccent(): Accent {
  try {
    const saved = window.localStorage.getItem("impact-accent");
    return saved === "blue" || saved === "violet" || saved === "orange" || saved === "rose" ? saved : "green";
  } catch {
    return "green";
  }
}

const entityTypeLabels: Record<Language, Record<string, string>> = {
  fr: {
    organization: "Organisation",
    brand: "Marque",
    product: "Produit",
    service: "Service",
    association: "Association",
    institution: "Institution",
    public_body: "Organisme public",
  },
  en: {
    organization: "Organization",
    brand: "Brand",
    product: "Product",
    service: "Service",
    association: "Association",
    institution: "Institution",
    public_body: "Public body",
  },
};

function entityTypeLabel(value: string, language: Language): string {
  return entityTypeLabels[language][value] ?? value.replaceAll("_", " ");
}


const copy: Record<Language, Record<string, string>> = {
  fr: {
    skip: "Aller au contenu", method: "Notre méthode", methodTitle: "Des faits vérifiables, pas des affirmations sans preuves.", methodIntro: "Chaque dossier distingue ce qui est établi, ce qui est rapporté par une source, ce qui reste incertain et ce qui est contesté.", methodSources: "Sources traçables", methodSourcesText: "Documents originaux, études, enquêtes et déclarations clairement attribuées, avec dates et liens consultables.", methodScope: "Périmètre précis", methodScopeText: "Produit, pays, période, échantillon et méthode sont indiqués. Aucun résultat n’est généralisé au-delà de ce qu’il mesure.", methodPublication: "Publication proportionnée", methodPublicationText: "Une affirmation peut être publiée sans validation humaine si les preuves et leur contrôle sont documentés. Les sujets à risque élevé exigent un examen humain.", methodResponse: "Contradictions et corrections", methodResponseText: "Les réponses des organisations, les limites et les corrections sont présentées sans transformer une réponse en preuve ni une allégation en fait.", switchLanguage: "Passer en anglais", themeLabel: "Apparence", lightMode: "Clair", darkMode: "Sombre", accentLabel: "Couleur", accentGreen: "Vert", accentBlue: "Bleu", accentViolet: "Violet", accentOrange: "Orange", accentRose: "Rose", settings: "Paramètres",
    kicker: "PROJET LIBRE · PREMIER PROTOTYPE",
    title: "Comprendre ce qui se cache derrière nos choix.",
    subtitle: "Des informations sourcées, des incertitudes visibles et des pistes d’action — sans décider à votre place.",
    searchLabel: "Rechercher dans IMPACT", placeholder: "Entreprise, marque, sujet, alternative…",
    searchHint: "La recherche couvre les univers, les outils et les dossiers publiés après vérification des sources.",
    explore: "Explorer les six univers", exploreText: "Six portes d’entrée pour comprendre les conséquences de nos choix.",
    tools: "Les outils IMPACT", toolsText: "Des outils conçus pour vérifier, comparer et suivre les changements.",
    results: "Résultats dans IMPACT", noResults: "Aucun résultat dans les dossiers, univers ou outils actuellement présentés.",
    clear: "Effacer", selected: "EXPLORER CET ESPACE", inPrep: "Espace en préparation",
    prepText: "Cette rubrique est encore en préparation. Les dossiers documentés déjà publiés sont accessibles depuis la recherche.",
    back: "Retour à l’accueil", privacy: "La confidentialité dès la conception",
    privacyText: "Le prototype n’a pas besoin de votre identité pour être consulté.",
    privacyOne: "Aucun compte ni profil", privacyTwo: "Aucun tracker ni outil d’audience",
    privacyThree: "Recherche locale, sans envoi au serveur",
    honest: "Ce prototype ne prétend pas en savoir plus qu’il ne sait.",
    honestText: "Les univers et outils ci-dessus sont des structures de navigation. Les informations factuelles sont publiées lorsque les sources et les preuves satisfont aux critères de la charte éditoriale. Les sujets sensibles nécessitent un examen renforcé. Le fonctionnement hors ligne doit encore être testé.",
    footer: "Projet open source · Licence AGPL-3.0-only · Aucune IA générative dans l’application publique",
    discover: "Découvrir", exploreLabel: "EXPLORER", crossTools: "OUTILS TRANSVERSAUX",
    localSearch: "RECHERCHE LOCALE", dossiers: "Dossiers documentés", dossiersText: "Fiches d’entités publiées selon les critères de preuve de la charte.", noDossiers: "Aucun dossier ne correspond à cette recherche. Les faits publiés renvoient à leurs sources et à leurs limites."
  },
  en: {
    skip: "Skip to content", method: "Our method", methodTitle: "Verifiable facts, not unsupported claims.", methodIntro: "Each dossier distinguishes established facts, what a source reports, what remains uncertain and what is disputed.", methodSources: "Traceable sources", methodSourcesText: "Original documents, studies, investigations and clearly attributed statements, with dates and accessible links.", methodScope: "Precise scope", methodScopeText: "Product, country, period, sample and method are stated. No result is generalized beyond what it measures.", methodPublication: "Evidence-based publication", methodPublicationText: "A claim may be published without human approval when its evidence and checks are documented. High-risk topics require human review.", methodResponse: "Disputes and corrections", methodResponseText: "Organization responses, limitations and corrections are shown without treating a response as proof or an allegation as fact.", switchLanguage: "Switch to French", themeLabel: "Appearance", lightMode: "Light", darkMode: "Dark", accentLabel: "Accent colour", accentGreen: "Green", accentBlue: "Blue", accentViolet: "Violet", accentOrange: "Orange", accentRose: "Rose", settings: "Settings",
    kicker: "OPEN PROJECT · FIRST PROTOTYPE",
    title: "Understand what sits behind our choices.",
    subtitle: "Sourced information, visible uncertainty and ways to act — without making decisions for you.",
    searchLabel: "Search IMPACT", placeholder: "Company, brand, topic, alternative…",
    searchHint: "Search covers areas, tools and dossiers published against documented evidence criteria.",
    explore: "Explore the six areas", exploreText: "Six entry points to understand the consequences of our choices.",
    tools: "IMPACT tools", toolsText: "Tools designed to verify, compare and track change.",
    results: "Results in IMPACT", noResults: "No results in the dossiers, areas or tools currently presented.",
    clear: "Clear", selected: "EXPLORE THIS SPACE", inPrep: "Area in preparation",
    prepText: "This area is still in preparation. Published documented dossiers are available through search.",
    back: "Back to home", privacy: "Privacy by design",
    privacyText: "This prototype does not need your identity to be browsed.",
    privacyOne: "No account or profile", privacyTwo: "No trackers or audience analytics",
    privacyThree: "Local search, never sent to a server",
    honest: "This prototype does not claim to know more than it does.",
    honestText: "The areas and tools above are navigation structures. Factual information is published when sources and evidence meet the editorial charter; sensitive topics require enhanced review. Offline behaviour still needs testing.",
    footer: "Open-source project · AGPL-3.0-only licence · No generative AI in the public app",
    discover: "Explore", exploreLabel: "EXPLORE", crossTools: "CROSS-CUTTING TOOLS",
    localSearch: "LOCAL SEARCH", dossiers: "Documented dossiers", dossiersText: "Entity records published under the charter's evidence criteria.", noDossiers: "No dossier matches this search. Published facts link to their sources and limitations."
  }
};


function ComparisonTool({ entities: availableEntities, leftId, rightId, onLeftChange, onRightChange }: {
  entities: EntityRecord[]; leftId: string; rightId: string;
  onLeftChange: (id: string) => void; onRightChange: (id: string) => void;
}) {
  const left = getEntityDossier(leftId);
  const right = getEntityDossier(rightId);
  const leftMetrics = left ? getComparisonMetrics(left) : null;
  const rightMetrics = right ? getComparisonMetrics(right) : null;
  const metrics = [
    ["claims", "Affirmations documentées"], ["verifiedSources", "Sources avec preuves vérifiées"],
    ["evidence", "Éléments de preuve"], ["commitments", "Engagements suivis"],
    ["responses", "Réponses publiées"], ["relationships", "Relations documentées"],
  ] as const;
  function changeLeft(id: string) {
    if (id === rightId) onRightChange("");
    onLeftChange(id);
  }
  return (
    <section className="comparison-tool" aria-labelledby="comparison-title">
      <div className="comparison-intro">
        <h3 id="comparison-title">Comparer les dossiers publiés</h3>
        <p>Cette comparaison mesure uniquement la documentation disponible dans IMPACT. Elle ne classe pas les entreprises et ne mesure pas directement leurs impacts réels.</p>
      </div>
      <div className="comparison-selectors">
        <label>Premier dossier<select value={leftId} onChange={(event) => changeLeft(event.currentTarget.value)}>
          {availableEntities.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)}
        </select></label>
        <label>Second dossier<select value={rightId} onChange={(event) => onRightChange(event.currentTarget.value)}>
          <option value="">Choisir un dossier</option>
          {availableEntities.filter((entity) => entity.id !== leftId).map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)}
        </select></label>
      </div>
      {availableEntities.length < 2 || !rightMetrics ? (
        <p className="comparison-empty">La comparaison nécessite au moins deux dossiers publiés. Pour le moment, IMPACT ne dispose pas encore de deux dossiers distincts.</p>
      ) : (
        <div className="comparison-table-wrap"><table className="comparison-table">
          <thead><tr><th scope="col">Critère documentaire</th><th scope="col">{left?.entity.name ?? "Premier dossier"}</th><th scope="col">{right?.entity.name ?? "Second dossier"}</th></tr></thead>
          <tbody>{metrics.map(([key, label]) => <tr key={key}><th scope="row">{label}</th><td>{leftMetrics?.[key] ?? "Non disponible"}</td><td>{rightMetrics?.[key] ?? "Non disponible"}</td></tr>)}</tbody>
        </table></div>
      )}
      <p className="comparison-caveat">Un nombre plus élevé de documents ne signifie pas automatiquement un meilleur ou un moins bon comportement. Les données absentes ne sont pas assimilées à zéro impact.</p>
    </section>
  );
}

function App() {
  const language: Language = "fr";
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [accent, setAccent] = useState<Accent>(getInitialAccent);
  const [query, setQuery] = useState("");
  const [comparisonLeftId, setComparisonLeftId] = useState(() => getPublishedEntities()[0]?.id ?? "");
  const [comparisonRightId, setComparisonRightId] = useState(() => getPublishedEntities()[1]?.id ?? "");
  const [selection, setSelection] = useState<Selection>(() => parseSelectionHash(window.location.hash));
  const t = copy[language];
  const trimmedQuery = normalizeSearch(query);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "fr"
      ? "IMPACT — Comprendre. Choisir. Agir."
      : "IMPACT — Understand. Choose. Act.";
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute(
      "content",
      language === "fr"
        ? "IMPACT — comprendre, vérifier, comparer et agir grâce à des informations documentées."
        : "IMPACT — understand, verify, compare and act with documented information.",
    );
  }, [language]);

  useEffect(() => {
    const handlePopState = () => {
      setSelection(parseSelectionHash(window.location.hash));
      setQuery("");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = accent;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#111b16" : accentColors[accent],
    );
    try {
      window.localStorage.setItem("impact-theme", theme);
      window.localStorage.setItem("impact-accent", accent);
    } catch {
      // The selected theme still applies for this session when storage is unavailable.
    }
  }, [theme, accent]);

  const foundUniverses = useMemo(
    () => trimmedQuery ? universes.filter((item) => matchesSearch(searchableText(item), trimmedQuery)) : [],
    [trimmedQuery],
  );
  const foundTools = useMemo(
    () => trimmedQuery ? tools.filter((item) => matchesSearch(searchableText(item), trimmedQuery)) : [],
    [trimmedQuery],
  );
  const publishedEntities = useMemo(() => getPublishedEntities(), []);
  const foundEntities = useMemo(
    () => trimmedQuery ? publishedEntities.filter((item) => matchesSearch(searchableEntityText(item, getEntityDossier(item.id)), trimmedQuery)) : [],
    [trimmedQuery, publishedEntities],
  );
  const chosen = selection && selection.type !== "entity"
    ? [...universes.map((item) => ({ ...item, type: "universe" as const })), ...tools.map((item) => ({ ...item, type: "tool" as const }))]
        .find((item) => item.id === selection.id && item.type === selection.type)
    : undefined;
  const selectedDossier = selection?.type === "entity" ? getEntityDossier(selection.id) : undefined;

  function open(type: "universe" | "tool" | "entity", id: string) {
    window.history.pushState({ impactSelection: { type, id } }, "", `#${type}/${encodeURIComponent(id)}`);
    setSelection({ type, id });
    setQuery("");
  }

  function reset() {
    if (selection && window.history.state?.impactSelection) {
      window.history.back();
      setQuery("");
      return;
    }
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setSelection(null);
    setQuery("");
  }

  function entityButton(item: EntityRecord) {
    return (
      <button className="result-item" key={item.id} type="button" onClick={() => open("entity", item.id)}>
        <span className="result-mark" aria-hidden="true">D</span>
        <span className="result-copy">
          <strong>{item.name}</strong>
          <span>{item.description || entityTypeLabel(item.entity_type, language)}</span>
        </span>
        <span className="result-arrow" aria-hidden="true">↗</span>
      </button>
    );
  }

  function itemButton(item: CatalogItem, type: "universe" | "tool") {
    return (
      <button className="result-item" key={item.id} type="button" onClick={() => open(type, item.id)}>
        <span className="result-mark" aria-hidden="true">{item.mark}</span>
        <span className="result-copy">
          <strong>{item.title[language]}</strong>
          <span>{item.description[language]}</span>
        </span>
        <span className="result-arrow" aria-hidden="true">↗</span>
      </button>
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" type="button" onClick={reset} aria-label={language === "fr" ? "IMPACT — accueil" : "IMPACT — home"}>
            <span className="brand-mark" aria-hidden="true">I</span>
            <span className="brand-copy"><strong>IMPACT</strong><span>{language === "fr" ? "Comprendre. Choisir. Agir." : "Understand. Choose. Act."}</span></span>
          </button>
          <div className="header-actions">
            <a className="text-link" href="#method" onClick={() => { setSelection(null); setQuery(""); }}>{t.method}</a>
            <details className="settings-menu">
              <summary className="settings-trigger" aria-label={t.settings}>
                <span className="settings-icon" aria-hidden="true">⚙</span><span>{t.settings}</span>
              </summary>
              <div className="settings-panel">
                <label className="settings-field" htmlFor="theme-select">
                  <span>{t.themeLabel}</span>
                  <select id="theme-select" className="language-select" value={theme}
                    onChange={(event) => setTheme(event.currentTarget.value as Theme)}
                    aria-label={t.themeLabel}>
                    <option value="dark">{t.darkMode}</option>
                    <option value="light">{t.lightMode}</option>
                  </select>
                </label>
                <label className="settings-field" htmlFor="accent-select">
                  <span>{t.accentLabel}</span>
                  <select id="accent-select" className="language-select" value={accent}
                    onChange={(event) => setAccent(event.currentTarget.value as Accent)}
                    aria-label={t.accentLabel}>
                    <option value="green">{t.accentGreen}</option>
                    <option value="blue">{t.accentBlue}</option>
                    <option value="violet">{t.accentViolet}</option>
                    <option value="orange">{t.accentOrange}</option>
                    <option value="rose">{t.accentRose}</option>
                  </select>
                </label>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="main" className="page-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" />{t.kicker}</div>
            <h1 id="hero-title">{t.title}</h1>
            <p className="hero-description">{t.subtitle}</p>
          </div>
          <div className="search-panel">
            <label htmlFor="global-search">{t.searchLabel}</label>
            <div className="search-field">
              <span className="search-symbol" aria-hidden="true">⌕</span>
              <input id="global-search" type="search" value={query}
                onChange={(event) => { window.history.replaceState(null, "", window.location.pathname + window.location.search); setQuery(event.currentTarget.value); setSelection(null); }}
                placeholder={t.placeholder} autoComplete="off" spellCheck={false} />
              {query && <button className="clear-button" type="button" onClick={() => setQuery("")}>{t.clear}</button>}
            </div>
            <p className="search-hint">{t.searchHint}</p>
          </div>
          <div className="trust-chips">
            <span><b aria-hidden="true">✓</b>{language === "fr" ? "Gratuit" : "Free"}</span>
            <span><b aria-hidden="true">✓</b>{language === "fr" ? "Sans compte" : "No account"}</span>
            <span><b aria-hidden="true">✓</b>{language === "fr" ? "Sans suivi publicitaire" : "No ad tracking"}</span>
          </div>
        </section>

        {trimmedQuery && (
          <section className="search-results" aria-live="polite" aria-labelledby="results-title">
            <div className="section-heading">
              <div><p className="section-kicker">{t.localSearch}</p><h2 id="results-title">{t.results}</h2></div>
              <span className="result-count">{foundUniverses.length + foundTools.length + foundEntities.length}</span>
            </div>
            {foundUniverses.length === 0 && foundTools.length === 0 && foundEntities.length === 0
              ? <p className="empty-state">{t.noResults}</p>
              : <div className="result-list">
                  {foundEntities.map((item) => entityButton(item))}
                  {foundUniverses.map((item) => itemButton(item, "universe"))}
                  {foundTools.map((item) => itemButton(item, "tool"))}
                </div>}
          </section>
        )}

        {chosen && (
          <section className="selected-panel" aria-labelledby="selected-title">
            <button className="back-button" type="button" onClick={reset}>← {t.back}</button>
            <div className="selected-heading">
              <span className="selected-mark" aria-hidden="true">{chosen.mark}</span>
              <div><p className="section-kicker">{t.selected}</p><h2 id="selected-title">{chosen.title[language]}</h2></div>
            </div>
            <p className="selected-description">{chosen.detail[language]}</p>
            {chosen.type === "tool" && chosen.id === "evidence" ? (
              <EvidenceCentre entities={publishedEntities} />
            ) : chosen.type === "tool" && chosen.id === "compare" ? (
              <ComparisonTool entities={publishedEntities} leftId={comparisonLeftId} rightId={comparisonRightId}
                onLeftChange={setComparisonLeftId} onRightChange={setComparisonRightId} />
            ) : (
              <div className="preparation-note">
                <span className="note-dot" aria-hidden="true" />
                <div><strong>{t.inPrep}</strong><p>{t.prepText}</p></div>
              </div>
            )}
          </section>
        )}

        {selectedDossier && <DossierPanel dossier={selectedDossier} language={language} onBack={reset} />}

        {!trimmedQuery && !chosen && !selectedDossier && (
          <>
            <section className="content-section dossiers-section" aria-labelledby="dossiers-title">
              <div className="section-heading">
                <div><p className="section-kicker">{language === "fr" ? "INFORMATIONS SOURCÉES" : "SOURCED INFORMATION"}</p><h2 id="dossiers-title">{t.dossiers}</h2><p>{t.dossiersText}</p></div>
              </div>
              {publishedEntities.length === 0 ? <p className="empty-state">{t.noDossiers}</p> : (
                <div className="dossier-grid">
                  {publishedEntities.map((item) => (
                    <button className="dossier-card" key={item.id} type="button" onClick={() => open("entity", item.id)}>
                      <span className="dossier-card-type">{entityTypeLabel(item.entity_type, language)}</span>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                      <span className="card-footer">{t.discover}<span aria-hidden="true">↗</span></span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="content-section" aria-labelledby="universes-title">
              <div className="section-heading">
                <div><p className="section-kicker">{t.exploreLabel}</p><h2 id="universes-title">{t.explore}</h2><p>{t.exploreText}</p></div>
                <span className="section-index">01 / 06</span>
              </div>
              <div className="universe-grid">
                {universes.map((item) => (
                  <button className="universe-card" key={item.id} type="button" onClick={() => open("universe", item.id)}>
                    <span className="universe-card-top"><span className="universe-mark" aria-hidden="true">{item.mark}</span><span className="universe-number">{item.number}</span></span>
                    <strong>{item.title[language]}</strong>
                    <span className="universe-description">{item.description[language]}</span>
                    <span className="card-footer">{t.discover}<span aria-hidden="true">↗</span></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="content-section tools-section" aria-labelledby="tools-title">
              <div className="section-heading">
                <div><p className="section-kicker">{t.crossTools}</p><h2 id="tools-title">{t.tools}</h2><p>{t.toolsText}</p></div>
              </div>
              <div className="tool-grid">
                {tools.map((item) => (
                  <button className="tool-card" key={item.id} type="button" onClick={() => open("tool", item.id)}>
                    <span className="tool-mark" aria-hidden="true">{item.mark}</span>
                    <span className="tool-copy"><strong>{item.title[language]}</strong><span>{item.description[language]}</span></span>
                    <span className="tool-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <section id="method" className="content-section editorial-method" aria-labelledby="method-title">
          <div className="section-heading">
            <div><p className="section-kicker">{language === "fr" ? "MÉTHODE ÉDITORIALE" : "EDITORIAL METHOD"}</p><h2 id="method-title">{t.methodTitle}</h2><p>{t.methodIntro}</p></div>
          </div>
          <div className="method-grid">
            <article className="method-card"><span>01</span><h3>{t.methodSources}</h3><p>{t.methodSourcesText}</p></article>
            <article className="method-card"><span>02</span><h3>{t.methodScope}</h3><p>{t.methodScopeText}</p></article>
            <article className="method-card"><span>03</span><h3>{t.methodPublication}</h3><p>{t.methodPublicationText}</p></article>
            <article className="method-card"><span>04</span><h3>{t.methodResponse}</h3><p>{t.methodResponseText}</p></article>
          </div>
        </section>

        <section id="privacy" className="method-section" aria-labelledby="privacy-title">
          <div className="method-copy">
            <p className="section-kicker">{language === "fr" ? "ENGAGEMENT FONDATEUR" : "FOUNDING PRINCIPLE"}</p>
            <h2 id="privacy-title">{t.privacy}</h2>
            <p>{t.privacyText}</p>
            <ul className="privacy-list">
              <li><span aria-hidden="true">✓</span>{t.privacyOne}</li>
              <li><span aria-hidden="true">✓</span>{t.privacyTwo}</li>
              <li><span aria-hidden="true">✓</span>{t.privacyThree}</li>
            </ul>
          </div>
          <div className="method-visual" aria-hidden="true">
            <div className="privacy-ring privacy-ring-outer" />
            <div className="privacy-ring privacy-ring-middle" />
            <div className="privacy-ring privacy-ring-inner"><span className="privacy-letter">I</span></div>
            <span className="orbit-label orbit-one">LOCAL</span><span className="orbit-label orbit-two">OPEN</span><span className="orbit-label orbit-three">HUMAN</span>
          </div>
        </section>

        <section className="reality-note">
          <span className="reality-icon" aria-hidden="true">i</span>
          <div><h2>{t.honest}</h2><p>{t.honestText}</p></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand"><span className="footer-mark" aria-hidden="true">I</span><strong>IMPACT</strong></div>
          <p>{t.footer}</p><span className="footer-version">Prototype 0.1</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
