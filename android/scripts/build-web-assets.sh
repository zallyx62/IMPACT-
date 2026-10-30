#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
APP_DIR="$ROOT_DIR/app"
ASSET_DIR="$ROOT_DIR/android/app/src/main/assets"

(
  cd "$APP_DIR"
  npm ci --no-audit --no-fund
  npm run build
)

if [ ! -f "$APP_DIR/dist/index.html" ]; then
  echo "Web production build did not produce app/dist/index.html" >&2
  exit 1
fi

rm -rf "$ASSET_DIR"
mkdir -p "$ASSET_DIR"
cp -R "$APP_DIR/dist/." "$ASSET_DIR/"

if [ ! -s "$ASSET_DIR/index.html" ]; then
  echo "Android web assets were not copied correctly." >&2
  exit 1
fi

echo "Android web assets prepared from the local Vite production build."
