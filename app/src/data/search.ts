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
