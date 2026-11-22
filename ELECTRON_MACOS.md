# Innesykkel for macOS

This branch adds the Electron desktop wrapper. The existing web app remains in index.html.

## Requirements

- macOS
- Node.js LTS and npm
- Xcode Command Line Tools
- Homebrew

## Install and run

```bash
npm install
npm start
```

## App icon

The master vector icon is assets/innesykkel.svg. Generate the macOS icon on your Mac:

```bash
brew install librsvg
bash scripts/create-macos-icon.sh
```

This creates assets/innesykkel.icns. The ICNS file is used by electron-builder for the packaged app icon and by Electron for the Dock icon during development.

## Build the macOS app

Install dependencies with npm install, then create an unpacked app for local testing:

```bash
npm run pack:mac
```

Create a distributable DMG and ZIP:

```bash
npm run dist:mac
```

The output is written to dist/. The build uses the architecture of the Mac that runs the command. To create a build for another architecture, use electron-builder's --x64 or --arm64 option.

The packaged app uses assets/innesykkel.icns as its Finder, Dock, and Launchpad app icon. Keep the generated ICNS file available locally before building. Do not commit signing credentials or passwords.

## Signing and notarization

Unsigned builds are suitable only for local testing. For distribution outside the Mac App Store, sign the app with an Apple Developer ID Application certificate and notarize it with Apple. electron-builder can use credentials supplied through environment variables. See the official electron-builder macOS and notarization guides:

- https://www.electron.build/v26/docs/mac/
- https://www.electron.build/v26/docs/notarization/

Do not set signing credentials in package.json or commit them to Git.

## Bluetooth

Electron opens a separate device picker as soon as a Web Bluetooth scan starts. The picker shows the search status and updates the device list as Electron discovers devices. The user can select a device or cancel the request.

The renderer prevents overlapping pairing requests. The Electron main process keeps the active selection callback and updates the picker during the scan. The existing Web Bluetooth code in index.html remains responsible for connecting to the selected device and using its GATT services.

Physical Bluetooth testing is required on macOS with the actual trainer and sensors. Verify trainer, power meter, heart rate sensor, CORE sensor, reconnect behavior, and the existing FIT, TCX, CSV, import, and local storage functions.

## Current limits

The macOS packaging configuration is in place, but the packaged app has not yet been built and tested on a Mac in this change. Signing and notarization require the appropriate Apple Developer credentials. Full physical Bluetooth validation is still required.


## Intervals.icu calendar sync

The desktop app can read planned workouts from Intervals.icu for today and the next seven local calendar days. The personal API key is encrypted with Electron safeStorage and stored under the app's macOS userData directory. If secure storage is unavailable, the key is not saved.

Calendar data is validated and written to a temporary file before an atomic rename. A failed request, timeout, invalid response, or offline state keeps the previous cache. The renderer loads the local cache first and syncs in the background at launch, when the network returns, and every 30 minutes. Intervals.icu sync is separate from Bluetooth, workout timing, and FIT recording.

To connect, open the app and select Intervals.icu in the header. Create a personal API key in Intervals.icu Developer Settings and paste it into the dialog. Use a read-only key. The initial implementation reads planned workout descriptions and converts their intervals into the app's workout steps. Workout descriptions that cannot be parsed are reported without affecting other app functions.
