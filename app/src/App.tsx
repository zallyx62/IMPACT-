import { useMemo, useState } from "react";
import { tools, universes, type CatalogItem, type Language } from "./data/catalog";

type Selection = { type: "universe" | "tool"; id: string } | null;

const copy: Record<Language, Record<string, string>> = {
  fr: {
    skip: "Aller au contenu", method: "Notre méthode", switchLanguage: "Passer en anglais",
    kicker: "PROJET LIBRE · PREMIER PROTOTYPE",
    title: "Comprendre ce qui se cache derrière nos choix.",
    subtitle: "Des informations sourcées, des incertitudes visibles et des pistes d’action — sans décider à votre place.",
    searchLabel: "Rechercher dans IMPACT", placeholder: "Entreprise, marque, sujet, alternative…",
    searchHint: "La recherche porte sur les six univers et les outils de ce prototype. Les dossiers factuels seront ajoutés après vérification humaine.",
    explore: "Explorer les six univers", exploreText: "Six portes d’entrée pour comprendre les conséquences de nos choix.",
    tools: "Les outils IMPACT", toolsText: "Des outils conçus pour vérifier, comparer et suivre les changements.",
    results: "Résultats dans le prototype", noResults: "Aucun résultat dans les univers ou outils actuellement présentés.",
    clear: "Effacer", selected: "EXPLORER CET ESPACE", inPrep: "Espace en préparation",
    prepText: "Cette version pose la structure de navigation. Elle ne contient pas encore de dossier factuel validé sur des entreprises, produits ou campagnes.",
    back: "Retour à l’accueil", privacy: "La confidentialité dès la conception",
    privacyText: "Le prototype n’a pas besoin de votre identité pour être consulté.",
    privacyOne: "Aucun compte ni profil", privacyTwo: "Aucun tracker ni outil d’audience",
    privacyThree: "Recherche locale, sans envoi au serveur",
    honest: "Ce prototype ne prétend pas en savoir plus qu’il ne sait.",
    honestText: "Les univers et outils ci-dessus sont des structures de navigation. Les informations factuelles ne seront publiées qu’avec des sources et une validation éditoriale humaine. Le fonctionnement hors ligne doit encore être testé.",
    footer: "Projet open source · Licence AGPL-3.0-only · Aucune IA générative dans l’application publique",
    discover: "Découvrir", exploreLabel: "EXPLORER", crossTools: "OUTILS TRANSVERSAUX",
    localSearch: "RECHERCHE LOCALE"
  },
  en: {
    skip: "Skip to content", method: "Our method", switchLanguage: "Switch to French",
    kicker: "OPEN PROJECT · FIRST PROTOTYPE",
    title: "Understand what sits behind our choices.",
    subtitle: "Sourced information, visible uncertainty and ways to act — without making decisions for you.",
    searchLabel: "Search IMPACT", placeholder: "Company, brand, topic, alternative…",
    searchHint: "Search covers the six areas and tools in this prototype. Factual dossiers will be added after human review.",
    explore: "Explore the six areas", exploreText: "Six entry points to understand the consequences of our choices.",
    tools: "IMPACT tools", toolsText: "Tools designed to verify, compare and track change.",
    results: "Results in this prototype", noResults: "No results in the areas or tools currently presented.",
    clear: "Clear", selected: "EXPLORE THIS SPACE", inPrep: "Area in preparation",
    prepText: "This version establishes the navigation structure. It does not yet contain fact-checked dossiers about companies, products or campaigns.",
    back: "Back to home", privacy: "Privacy by design",
    privacyText: "This prototype does not need your identity to be browsed.",
    privacyOne: "No account or profile", privacyTwo: "No trackers or audience analytics",
    privacyThree: "Local search, never sent to a server",
    honest: "This prototype does not claim to know more than it does.",
    honestText: "The areas and tools above are navigation structures. Factual information will only be published with sources and human editorial review. Offline behaviour still needs testing.",
    footer: "Open-source project · AGPL-3.0-only licence · No generative AI in the public app",
    discover: "Explore", exploreLabel: "EXPLORE", crossTools: "CROSS-CUTTING TOOLS",
    localSearch: "LOCAL SEARCH"
  }
};

function searchableText(item: CatalogItem): string {
  return [
    item.title.fr, item.title.en, item.description.fr, item.description.en,
    ...item.keywords,
  ].join(" ").toLocaleLowerCase();
}

function App() {
  const [language, setLanguage] = useState<Language>("fr");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>(null);
  const t = copy[language];
  const trimmedQuery = query.trim().toLocaleLowerCase();

  const foundUniverses = useMemo(
    () => trimmedQuery ? universes.filter((item) => searchableText(item).includes(trimmedQuery)) : [],
    [trimmedQuery],
  );
  const foundTools = useMemo(
    () => trimmedQuery ? tools.filter((item) => searchableText(item).includes(trimmedQuery)) : [],
    [trimmedQuery],
  );
  const chosen = selection
    ? [...universes.map((item) => ({ ...item, type: "universe" as const })), ...tools.map((item) => ({ ...item, type: "tool" as const }))]
        .find((item) => item.id === selection.id && item.type === selection.type)
    : undefined;

  function open(type: "universe" | "tool", id: string) {
    setSelection({ type, id });
    setQuery("");
  }

  function reset() {
    setSelection(null);
    setQuery("");
  }

  function itemButton(item: CatalogItem, type: "universe" | "tool") {
    return (
      <button className="result-item" key={item.id} type="button" onClick={() => open(type, item.id)}>
        <span className="result-mark">{item.mark}</span>
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
          <button className="brand" type="button" onClick={reset} aria-label="IMPACT — accueil">
            <span className="brand-mark" aria-hidden="true">I</span>
            <span className="brand-copy"><strong>IMPACT</strong><span>Comprendre. Vérifier. Agir.</span></span>
          </button>
          <div className="header-actions">
            <a className="text-link" href="#method">{t.method}</a>
            <button className="language-button" type="button" aria-label={t.switchLanguage}
              onClick={() => setLanguage((current) => current === "fr" ? "en" : "fr")}>
              {language === "fr" ? "EN" : "FR"}
            </button>
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
                onChange={(event) => { setQuery(event.currentTarget.value); setSelection(null); }}
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
              <span className="result-count">{foundUniverses.length + foundTools.length}</span>
            </div>
            {foundUniverses.length === 0 && foundTools.length === 0
              ? <p className="empty-state">{t.noResults}</p>
              : <div className="result-list">
                  {foundUniverses.map((item) => itemButton(item, "universe"))}
                  {foundTools.map((item) => itemButton(item, "tool"))}
                </div>}
          </section>
        )}

        {chosen && (
          <section className="selected-panel" aria-labelledby="selected-title">
            <button className="back-button" type="button" onClick={reset}>← {t.back}</button>
            <div className="selected-heading">
              <span className="selected-mark">{chosen.mark}</span>
              <div><p className="section-kicker">{t.selected}</p><h2 id="selected-title">{chosen.title[language]}</h2></div>
            </div>
            <p className="selected-description">{chosen.detail[language]}</p>
            <div className="preparation-note">
              <span className="note-dot" aria-hidden="true" />
              <div><strong>{t.inPrep}</strong><p>{t.prepText}</p></div>
            </div>
          </section>
        )}

        {!trimmedQuery && !chosen && (
          <>
            <section className="content-section" aria-labelledby="universes-title">
              <div className="section-heading">
                <div><p className="section-kicker">{t.exploreLabel}</p><h2 id="universes-title">{t.explore}</h2><p>{t.exploreText}</p></div>
                <span className="section-index">01 / 06</span>
              </div>
              <div className="universe-grid">
                {universes.map((item) => (
                  <button className="universe-card" key={item.id} type="button" onClick={() => open("universe", item.id)}>
                    <span className="universe-card-top"><span className="universe-mark">{item.mark}</span><span className="universe-number">{item.number}</span></span>
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
                    <span className="tool-mark">{item.mark}</span>
                    <span className="tool-copy"><strong>{item.title[language]}</strong><span>{item.description[language]}</span></span>
                    <span className="tool-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <section id="method" className="method-section" aria-labelledby="privacy-title">
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
          <div className="footer-brand"><span className="footer-mark">I</span><strong>IMPACT</strong></div>
          <p>{t.footer}</p><span className="footer-version">Prototype 0.1</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
