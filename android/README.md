# IMPACT for Android

The Android project is a local, offline-first host for the IMPACT web application. It embeds the production web build in the APK; it does not load the IMPACT website from a remote server.

## Requirements

- JDK 17
- Gradle 9.6.0
- Android SDK Platform 36 and Build Tools 36.0.0
- Node.js 22.12 or later and npm

The Android Gradle Plugin is pinned to 9.5.0. The WebView asset handler serves the APK assets root at the local `/impact/` origin path and uses the AndroidX WebKit 1.18.0 `AssetsPathHandler(Context)` constructor. Requests for the root path map explicitly to `index.html`, allowing the bundled service worker to cache its shell.

## Build

From the repository root:

```sh
sh android/scripts/build-web-assets.sh
cd android
gradle --no-daemon :app:assembleDebug
```

The debug APK is created at:

`android/app/build/outputs/apk/debug/app-debug.apk`

For a release build, run `gradle --no-daemon :app:assembleRelease`. The release APK is unsigned until a distribution process signs it; never commit signing keys or credentials.

## Privacy and security

- The Android manifest declares no `INTERNET` permission.
- App content is served from bundled assets through AndroidX `WebViewAssetLoader`, not `file://`.
- WebView file and content-provider access are disabled.
- HTTP/HTTPS links are opened in the user's external browser after an explicit tap; external pages are never loaded inside the app WebView.
- The WebView DOM storage is enabled only because the web app uses local storage for the user's Light/Dark display preference. The preference remains on the device.
- No account, analytics, advertising, telemetry or remote app API is included.

## Current limits

This is an Android build prototype, not a release. It still requires a successful clean build, installation and testing on physical Android devices, screen-reader review, security review and a documented signing/release process. F-Droid inclusion is not yet ready; see [the F-Droid preparation notes](../docs/ANDROID_FDROID.md).
