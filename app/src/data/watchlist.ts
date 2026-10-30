import type { EntityDossier } from "./records";

export const WATCHLIST_STORAGE_KEY = "impact-local-watchlist-v1";

export interface WatchlistEntry {
  lastSeenActivityDate: string | null;
}

export type Watchlist = Record<string, WatchlistEntry>;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function browserStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function isWatchlistStorageAvailable(storage: StorageLike | null = browserStorage()): boolean {
  if (!storage) return false;
  try {
    const value = storage.getItem(WATCHLIST_STORAGE_KEY);
    storage.setItem(WATCHLIST_STORAGE_KEY, value ?? "{}");
    return true;
  } catch {
    return false;
  }
}

export function readWatchlist(storage: StorageLike | null = browserStorage()): Watchlist {
  if (!storage) return {};
  try {
    const raw = storage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).flatMap(([id, value]) => {
      if (!id || !value || typeof value !== "object" || Array.isArray(value)) return [];
      const date = (value as { lastSeenActivityDate?: unknown }).lastSeenActivityDate;
      return [[id, { lastSeenActivityDate: typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null }]];
    }));
  } catch {
    return {};
  }
}

export function writeWatchlist(watchlist: Watchlist, storage: StorageLike | null = browserStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    return true;
  } catch {
    return false;
  }
}

export function followDossier(watchlist: Watchlist, dossierId: string, latestActivityDate: string | null): Watchlist {
  return { ...watchlist, [dossierId]: { lastSeenActivityDate: latestActivityDate } };
}

export function unfollowDossier(watchlist: Watchlist, dossierId: string): Watchlist {
  const next = { ...watchlist };
  delete next[dossierId];
  return next;
}

export function markDossierSeen(watchlist: Watchlist, dossierId: string, latestActivityDate: string | null): Watchlist {
  if (!watchlist[dossierId]) return watchlist;
  return followDossier(watchlist, dossierId, latestActivityDate);
}

export function hasNewDossierActivity(
  watchlist: Watchlist,
  dossierId: string,
  latestActivityDate: string | null,
): boolean {
  const entry = watchlist[dossierId];
  return Boolean(entry && latestActivityDate && (!entry.lastSeenActivityDate || latestActivityDate > entry.lastSeenActivityDate));
}

function validDate(value: string | null | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

/** Returns the newest dated public activity; planned deadlines are deliberately excluded. */
export function getLatestDossierActivityDate(dossier: EntityDossier): string | null {
  const dates: string[] = [];
  const add = (value: string | null | undefined) => { if (validDate(value)) dates.push(value); };
  add(dossier.entity.published_at);
  add(dossier.entity.updated_at);
  add(dossier.entity.reviewed_at);
  dossier.claims.forEach((claim) => { add(claim.published_at); add(claim.reviewed_at); });
  dossier.responses.forEach((response) => { add(response.published_at); add(response.received_at); });
  dossier.commitments.forEach((commitment) => { add(commitment.announced_at); add(commitment.reviewed_at); });
  dossier.changes.forEach((change) => { add(change.event_date); add(change.reviewed_at); });
  return dates.sort().at(-1) ?? null;
}
