import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../app/public/sw.js", import.meta.url), "utf8");
const handlers = new Map();
const stores = new Map();
let skipWaitingCalled = false;
let clientsClaimed = false;
let networkFetch = async (url) => response(`network:${url}`);

function response(body) {
  return {
    body,
    ok: true,
    type: "basic",
    clone() { return response(this.body); },
    async text() { return this.body; },
  };
}

function cacheFor(name) {
  if (!stores.has(name)) stores.set(name, new Map());
  const entries = stores.get(name);
  return {
    async addAll(urls) {
      for (const url of urls) entries.set(url, response(`precache:${url}`));
    },
    async put(request, value) {
      entries.set(typeof request === "string" ? request : request.url, value);
    },
    async match(request) {
      return entries.get(typeof request === "string" ? request : request.url);
    },
  };
}

const cachesMock = {
  async open(name) { return cacheFor(name); },
  async keys() { return [...stores.keys()]; },
  async delete(name) { return stores.delete(name); },
  async match(request) {
    for (const entries of stores.values()) {
      const found = entries.get(typeof request === "string" ? request : request.url);
      if (found) return found;
    }
    return undefined;
  },
};

const self = {
  location: { href: "https://example.test/app/sw.js", origin: "https://example.test" },
  clients: { async claim() { clientsClaimed = true; } },
  addEventListener(name, callback) { handlers.set(name, callback); },
  async skipWaiting() { skipWaitingCalled = true; },
};

vm.runInNewContext(source, {
  self,
  caches: cachesMock,
  fetch: (...args) => networkFetch(...args),
  URL,
  Promise,
  Error,
});

async function dispatch(name, event) {
  handlers.get(name)(event);
  if (event.pending) await event.pending;
}
function lifecycleEvent() {
  return { waitUntil(promise) { this.pending = promise; } };
}
function fetchEvent(request) {
  return {
    request,
    respondWith(promise) { this.response = promise; },
  };
}

await dispatch("install", lifecycleEvent());
assert.equal(skipWaitingCalled, true, "install activates the new worker");
assert.ok(stores.get("impact-shell-v0.2").has("/app/"), "install precaches the app shell");
assert.ok(stores.get("impact-shell-v0.2").has("/app/manifest.webmanifest"), "install precaches the manifest");
console.log("PASS install precaches the application shell");

stores.set("impact-shell-v0.1", new Map());
await dispatch("activate", lifecycleEvent());
assert.equal(stores.has("impact-shell-v0.1"), false, "activation removes the previous cache");
assert.equal(clientsClaimed, true, "activation claims open clients");
console.log("PASS activation cleans old caches and claims clients");

const navigation = fetchEvent({ method: "GET", url: "https://example.test/app/", mode: "navigate" });
networkFetch = async () => response("fresh online page");
handlers.get("fetch")(navigation);
assert.equal(await (await navigation.response).text(), "fresh online page");
assert.equal(await (await cachesMock.match("/app/")).text(), "fresh online page");
console.log("PASS navigation refreshes and updates the offline shell");

networkFetch = async () => { throw new Error("offline"); };
const offlineNavigation = fetchEvent({ method: "GET", url: "https://example.test/app/deep-link", mode: "navigate" });
handlers.get("fetch")(offlineNavigation);
assert.equal(await (await offlineNavigation.response).text(), "fresh online page");
console.log("PASS offline navigation falls back to the cached application shell");

networkFetch = async () => response("cached asset");
const assetRequest = { method: "GET", url: "https://example.test/app/assets/app.js", mode: "no-cors" };
const firstAsset = fetchEvent(assetRequest);
handlers.get("fetch")(firstAsset);
assert.equal(await (await firstAsset.response).text(), "cached asset");
networkFetch = async () => { throw new Error("offline"); };
const secondAsset = fetchEvent(assetRequest);
handlers.get("fetch")(secondAsset);
assert.equal(await (await secondAsset.response).text(), "cached asset");
console.log("PASS static assets remain available offline");

const postRequest = fetchEvent({ method: "POST", url: "https://example.test/app/submit", mode: "cors" });
handlers.get("fetch")(postRequest);
assert.equal(postRequest.response, undefined, "POST requests are not intercepted");
const externalRequest = fetchEvent({ method: "GET", url: "https://other.test/file.js", mode: "cors" });
handlers.get("fetch")(externalRequest);
assert.equal(externalRequest.response, undefined, "cross-origin requests are not intercepted");
console.log("PASS non-GET and cross-origin requests are left untouched");

console.log("All service-worker tests passed (6 groups).");
