import type { CatalogItem } from "./catalog";

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function searchableText(item: CatalogItem): string {
  return normalizeSearch([
    item.title.fr,
    item.title.en,
    item.description.fr,
    item.description.en,
    ...item.keywords,
  ].join(" "));
}

export function matchesSearch(value: string, query: string): boolean {
  const terms = normalizeSearch(query).split(/\s+/u).filter(Boolean);
  if (terms.length === 0) return false;

  const normalizedValue = normalizeSearch(value);
  return terms.every((term) => normalizedValue.includes(term));
}
