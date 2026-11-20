#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/assets/innesykkel.svg"
ICONSET="$ROOT/assets/innesykkel.iconset"
OUTPUT="$ROOT/assets/innesykkel.icns"
TMP="$ROOT/assets/.innesykkel-icon.png"

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "Install librsvg first: brew install librsvg" >&2
  exit 1
fi

mkdir -p "$ICONSET"
rsvg-convert -w 1024 -h 1024 "$SOURCE" -o "$TMP"

for size in 16 32 128 256 512; do
  sips -z "$size" "$size" "$TMP" --out "$ICONSET/icon_${size}x${size}.png" >/dev/null
  double=$((size * 2))
  sips -z "$double" "$double" "$TMP" --out "$ICONSET/icon_${size}x${size}@2x.png" >/dev/null
done

iconutil -c icns "$ICONSET" -o "$OUTPUT"
rm -rf "$ICONSET" "$TMP"
echo "Created $OUTPUT"
