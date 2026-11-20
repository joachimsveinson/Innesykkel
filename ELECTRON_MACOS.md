# Innesykkel for macOS

This branch adds the first Electron desktop wrapper. The existing web app remains in `index.html`.

## Requirements

- macOS
- Node.js LTS and npm
- Git

## Install and run

```bash
npm install
npm install --save-dev electron
npm start
```

## App icon

The master vector icon is `assets/innesykkel.svg`. It uses the app's cyan accent color, `#19D0E8`, with a bicycle and lightning bolt.

macOS Dock icons are supplied as ICNS files inside the packaged app bundle. The SVG is the editable source. On a Mac, install librsvg and run:

```bash
brew install librsvg
bash scripts/create-macos-icon.sh
```

This creates `assets/innesykkel.icns`. The ICNS file must then be assigned as the app icon in the macOS packaging configuration when the distributable app is built. Running the development app with `npm start` does not replace the Electron Dock icon.

## Bluetooth

Electron opens a separate device picker as soon as a Web Bluetooth scan starts. The picker shows the search status and updates the device list as Electron discovers devices. The user can select a device or cancel the request.

The renderer prevents overlapping pairing requests. The Electron main process keeps the active selection callback and updates the picker during the scan. The existing Web Bluetooth code in `index.html` remains responsible for connecting to the selected device and using its GATT services.

Physical Bluetooth testing is required on macOS with the actual trainer and sensors. Verify trainer, power meter, heart rate sensor, CORE sensor, reconnect behavior, and the existing FIT, TCX, CSV, import, and local storage functions.

## Current limits

This is a development wrapper. The Bluetooth picker and pairing lock have not yet been validated on a Mac with physical sensors. It is not a signed or notarized Mac release. Packaging, app permissions, installer creation, and full physical Bluetooth validation remain to be completed.
