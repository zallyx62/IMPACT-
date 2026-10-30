import test from "node:test";
import assert from "node:assert/strict";
import {
  WATCHLIST_STORAGE_KEY, followDossier, getLatestDossierActivityDate, hasNewDossierActivity,
  isWatchlistStorageAvailable, markDossierSeen, readWatchlist, unfollowDossier, writeWatchlist,
} from "../app/src/data/watchlist.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    values,
  };
}

test("watchlist persists only local dossier IDs and seen dates", () => {
  const storage = memoryStorage();
  const followed = followDossier({}, "nestle", "2026-01-10");
  assert.equal(writeWatchlist(followed, storage), true);
  assert.equal(storage.values.has(WATCHLIST_STORAGE_KEY), true);
  assert.deepEqual(readWatchlist(storage), followed);
  assert.equal(isWatchlistStorageAvailable(storage), true);
});

test("watchlist safely handles unavailable and malformed storage", () => {
  const broken = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.deepEqual(readWatchlist(broken), {});
  assert.equal(writeWatchlist({}, broken), false);
  assert.equal(isWatchlistStorageAvailable(broken), false);
  const malformed = memoryStorage();
  malformed.setItem(WATCHLIST_STORAGE_KEY, "{");
  assert.deepEqual(readWatchlist(malformed), {});
});

test("new activity is detected only after the last seen date", () => {
  const followed = followDossier({}, "nestle", "2026-01-10");
  assert.equal(hasNewDossierActivity(followed, "nestle", "2026-01-10"), false);
  assert.equal(hasNewDossierActivity(followed, "nestle", "2026-02-01"), true);
  assert.equal(hasNewDossierActivity(followed, "nestle", null), false);
  assert.equal(hasNewDossierActivity({}, "nestle", "2026-02-01"), false);
  assert.deepEqual(markDossierSeen(followed, "nestle", "2026-02-01"), followDossier({}, "nestle", "2026-02-01"));
});

test("unfollow removes only the selected dossier", () => {
  const followed = followDossier(followDossier({}, "nestle", "2026-01-10"), "other", null);
  assert.deepEqual(unfollowDossier(followed, "nestle"), { other: { lastSeenActivityDate: null } });
});

test("latest activity excludes future planned deadlines", () => {
  const dossier = {
    entity: { published_at: "2025-01-01", updated_at: "2025-03-01" },
    claims: [{ published_at: "2025-04-01", reviewed_at: null }],
    responses: [{ received_at: "2025-05-01", published_at: null }],
    commitments: [{ announced_at: "2025-02-01", target_date: "2030-01-01", reviewed_at: null }],
    changes: [{ event_date: "2025-06-01", reviewed_at: "2025-06-02" }],
  };
  assert.equal(getLatestDossierActivityDate(dossier), "2025-06-02");
});
