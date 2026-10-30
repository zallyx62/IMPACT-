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
- The WebView DOM storage is enabled only because the web app stores the user's dark/light mode and accent-colour preferences locally on the device. The preference remains on the device.
- No account, analytics, advertising, telemetry or remote app API is included.

## Updates: F-Droid-first policy

IMPACT will use F-Droid as the trusted update manager for the F-Droid edition:

- **Automatic updates:** when IMPACT is distributed through an F-Droid repository, the F-Droid client checks for new repository metadata and can download/install updates according to the user's F-Droid settings and Android's confirmation/permission rules.
- **Manual updates:** the user can open F-Droid, refresh/check for updates, and choose when to install an available IMPACT update.
- **Direct APK edition:** if a separate direct-download channel is ever offered, its update flow must be a clearly labelled, opt-in alternative. It must explain that the user is leaving F-Droid's build/signature verification path, verify the package signature and checksum, and require Android's explicit installation confirmation.

The app itself will not silently download or install replacement APKs. The Android manifest intentionally has no Internet or package-install permission at this stage. This avoids adding network access and bypassing F-Droid's trusted update flow. F-Droid's current inclusion policy requires explicit opt-in before downloading executable updates outside its checks. The exact in-app links and update screen can only be finalized after an official F-Droid package/repository URL exists.

Release maintainers must increment versionCode for every release and update versionName; F-Droid can detect Gradle version fields and automatically process tagged releases. Never reuse a version code or change the signing key after publication.

## Current limits

This is an Android build prototype, not a release. It still requires a successful clean build, installation and testing on physical Android devices, screen-reader review, security review and a documented signing/release process. F-Droid inclusion is not yet ready; see [the F-Droid preparation notes](../docs/ANDROID_FDROID.md).
