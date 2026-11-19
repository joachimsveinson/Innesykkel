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

## Bluetooth

The Electron main process handles Chromium's `select-bluetooth-device` event and displays a native device picker. The existing Web Bluetooth code in `index.html` remains responsible for connecting to the selected device and using its GATT services.

Physical Bluetooth testing is required on macOS with the actual trainer and sensors. Verify trainer, power meter, heart rate sensor, CORE sensor, reconnect behavior, and the existing FIT, TCX, CSV, import, and local storage functions.

## Current limits

This is an initial development wrapper. It is not yet a signed or notarized Mac release. Packaging, app permissions, installer creation, and physical Bluetooth validation remain to be completed.
