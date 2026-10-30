import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const manifest = await readFile(new URL("android/app/src/main/AndroidManifest.xml", root), "utf8");
const activity = await readFile(new URL("android/app/src/main/java/org/zallyx62/impact/MainActivity.java", root), "utf8");
const gradle = await readFile(new URL("android/app/build.gradle.kts", root), "utf8");
const buildScript = await readFile(new URL("android/scripts/build-web-assets.sh", root), "utf8");

assert.ok(!manifest.includes("<uses-permission"), "Android app must not request permissions by default");
assert.ok(!manifest.includes("android.permission.INTERNET"), "Android app must not request Internet access");
assert.ok(activity.includes("WebViewAssetLoader"), "local web assets must use WebViewAssetLoader");
assert.ok(activity.includes("setAllowFileAccess(false)"), "WebView file access must be disabled");
assert.ok(activity.includes("setAllowContentAccess(false)"), "WebView content-provider access must be disabled");
assert.ok(activity.includes("setAllowFileAccessFromFileURLs(false)"), "file URL access must be disabled");
assert.ok(activity.includes("setAllowUniversalAccessFromFileURLs(false)"), "universal file URL access must be disabled");
assert.ok(activity.includes('ASSET_HOST = "appassets.androidplatform.net"'), "the local asset origin must be explicit");
assert.ok(activity.includes('APP_PATH = "/impact/"'), "bundled assets must be isolated under a dedicated path");
assert.ok(activity.includes('new WebViewAssetLoader.AssetsPathHandler(this)'), "the WebKit-compatible asset handler constructor must be used");
assert.ok(activity.includes("uri.getPath().startsWith(APP_PATH)"), "only the embedded app path may remain inside the WebView");
assert.ok(activity.includes("Intent.ACTION_VIEW"), "external links must open in the system browser");
assert.ok(activity.includes('"https".equals(scheme) || "http".equals(scheme)'), "only web links may be handed to the browser");
assert.ok(activity.includes("setJavaScriptEnabled(true)"), "the bundled React app requires JavaScript");
assert.ok(activity.includes("setDomStorageEnabled(true)"), "the local theme preference requires DOM storage");
assert.ok(gradle.includes('applicationId = "org.zallyx62.impact"'));
assert.ok(gradle.includes('androidx.webkit:webkit:1.18.0'));
assert.ok(buildScript.includes("npm ci") && buildScript.includes("npm run build"));
assert.ok(buildScript.includes("app/dist") && buildScript.includes("assets/impact"));

console.log("Android wrapper invariants passed: local assets, minimal permissions, restricted WebView and local-only theme storage.");
