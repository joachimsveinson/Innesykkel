# Innesykkel

Innesykkel er en desktopapp for innendørs sykkeltrening. Den bruker Electron på macOS og Web Bluetooth for å koble til smarttrainer og sensorer. Brukergrensesnittet ligger hovedsakelig i `index.html`.

Appen er laget for personlig bruk. Treningsdata lagres lokalt, og du kan eksportere øktene dine.

## Funksjoner

### Trening

- Fri tur med eller uten fast wattmål.
- Treningsøkter med import av `.zwo`- og `.mrc`-filer.
- Et lokalt bibliotek med 26 forhåndslagrede økter fra Olympiatoppens øktforslag.
- Visning av økter fra Intervals.icu kalenderen.
- Pulsbasert ERG-modus som justerer motstanden for å holde pulsen innenfor et valgt område.
- Vanlig ERG-styring på kompatibel smarttrainer.
- Visning av watt, puls, kadens, fart, kjernetemperatur og hudtemperatur.
- Graf for watt og puls, med visning av treningssteg.
- Manuelle runder, rundestatistikk og hurtigtaster.
- Gjenoppretting av en økt hvis appen lukkes eller siden lastes inn på nytt.

### Intervals.icu

Du kan koble appen til Intervals.icu med en API-nøkkel. Appen henter dagens treningsøkt og planlagte økter for de neste sju dagene. Når Intervals.icu leverer en ZWO-fil, bruker appen denne til å bygge økten.

Kalenderdata og øktfiler mellomlagres lokalt. Appen kan derfor vise sist synkroniserte data uten nettverk. Synkronisering skjer separat fra treningsstyringen og skal ikke blokkere en aktiv økt.

API-nøkkelen lagres kryptert med Electron safeStorage på enheten. Ikke del API-nøkkelen eller filene med lagrede legitimasjonsopplysninger.

### Treningsdata og analyse

Appen viser blant annet:

- Normalisert watt (NP).
- Training Stress Score (TSS).
- Effektivitetsfaktor (EF).
- Gjennomsnittlig og maksimal puls.
- Distanse og akkumulert arbeid i kJ.
- Analyse av forholdet mellom watt, puls og CORE-data når datagrunnlaget er tilgjengelig.

Beregningene er ment som treningsinformasjon. Verdiene kan avvike fra andre treningsplattformer, særlig hvis datagrunnlaget eller beregningsmetoden er forskjellig.

### Eksport

Etter en økt kan du eksportere data i disse formatene:

| Format | Innhold |
| --- | --- |
| FIT | Treningsdata, runder, sensorverdier og øktinformasjon. Kan også inneholde en syntetisk GPS-rute. |
| TCX | Grunnleggende treningsdata med tid, puls, kadens, watt og CORE-data i utvidelsesfeltene. |
| CSV | Tidsserier med watt, puls, kadens, fart, distanse, kjernetemperatur, hudtemperatur og CORE-relaterte felt. |

FIT-eksporten kan merkes med Garmin Edge 840 som enhetsmodell. Dette er metadata i filen. Det garanterer ikke at Garmin Connect beregner Training Effect, belastning eller andre Garmin-spesifikke målinger.

Virtuell GPS er valgfritt og brukes for å legge en beregnet rute inn i FIT-filen. Ruten er syntetisk. Den er ikke målt med GPS.

## Utstyr og tilkobling

Appen bruker Web Bluetooth. Den er laget for disse enhetstypene:

- Smarttrainer med Bluetooth Fitness Machine Service (FTMS), for eksempel Wahoo KICKR CORE.
- Kraftsensor med Bluetooth Cycling Power Service.
- Pulssensor med Bluetooth Heart Rate Service.
- CORE kroppstemperatursensor.

Funksjoner og tilgjengelige data avhenger av enheten og Bluetooth-profilen den støtter. En wattpedal kan for eksempel levere kraftdata uten at den leverer kadens.

Electron-versjonen har et eget Bluetooth-valgvindu. Tilgjengelige enheter og stabilitet avhenger fortsatt av macOS, Bluetooth-maskinvaren og enhetene du kobler til.

## Kom i gang på macOS

### Kjør fra kildekoden

Du trenger Node.js og npm.

1. Klon repositoryet og velg branchen `feature/electron-macos`.
2. Åpne prosjektmappen i Terminal.
3. Installer avhengighetene:

   ```bash
   npm install
   ```

4. Start appen:

   ```bash
   npm start
   ```

### Bygg appen

Bygg en lokal macOS-app uten installasjonspakke:

```bash
npm run pack:mac
```

Appen blir lagt i `dist/`. På en Apple Silicon Mac er den forventede plasseringen:

```text
dist/mac-arm64/Innesykkel.app
```

Åpne appen med:

```bash
open dist/mac-arm64/Innesykkel.app
```

Lag DMG- og ZIP-pakker med:

```bash
npm run dist:mac
```

Byggene er ikke signert eller notarized med en Apple Developer ID. macOS kan derfor vise en sikkerhetsadvarsel ved første oppstart. Dette er forventet for den nåværende utviklingsbyggen.

## Komme i gang med trening

1. Start Innesykkel.
2. Koble til smarttrainer og sensorer med knappene øverst i appen.
3. Angi FTP. Appen bruker FTP i treningsberegninger og ERG-styring.
4. Velg Fri tur, Treningsøkt eller Puls-ERG.
5. Velg en økt fra Intervals.icu kalenderen, det forhåndslagrede biblioteket eller importer en `.zwo`- eller `.mrc`-fil.
6. Start økten.
7. Når økten er ferdig, åpner du øktsammendraget og velger ønsket eksportformat.

Du kan koble til bare sensorene du trenger. Appen viser ikke målinger som sensoren ikke leverer.

## Data og personvern

Treningsdata og innstillinger lagres lokalt på enheten. Appen har ingen egen Innesykkel-server eller brukerkonto.

Hvis du kobler til Intervals.icu, sender appen forespørsler til Intervals.icu med API-nøkkelen din for å hente kalenderdata og øktfiler. API-nøkkelen lagres kryptert med Electron safeStorage. Synkroniserte kalenderdata lagres i en lokal cache.

Eksporterte filer lagres der du velger å lagre dem. Fontfiler kan lastes fra Google Fonts når nettverk er tilgjengelig.

## Kjente begrensninger

- Appen er utviklet og pakket for macOS med Electron. Andre operativsystemer er ikke dokumentert eller testet.
- Bluetooth-tilkobling og sensordata avhenger av macOS, Electron og enheten.
- Appen er ikke signert eller notarized med Apple Developer ID.
- Intervals.icu krever nettverk for ny synkronisering. Uten nettverk kan appen bruke sist lagrede kalenderdata.
- Innholdet i en Intervals.icu økt avhenger av at tjenesten leverer en støttet ZWO-fil eller en beskrivelse som appen kan tolke.
- CORE-data omfatter kjernetemperatur, hudtemperatur, datakvalitet, reservert verdi og HSI (Heat Strain Index) når sensoren sender disse feltene. HSI krever CORE-fastvare 0.8.7 eller nyere. Hudtemperatur dekodes som en 12-bits verdi delt på 20. Eksporten tar med HSI i FIT og CSV. TCX legger HSI og hudtemperatur i utvidelsesfeltene.
- FIT-filen bruker Garmin-relaterte metadata og felt, men er ikke en garanti for identisk oppførsel med en ekte Garmin Edge-enhet.
- Virtuell GPS er beregnet og skal ikke brukes som dokumentasjon på faktisk posisjon eller tilbakelagt utendørs rute.
- Prosjektet er under utvikling. Kontroller eksportfilene før du bruker dem som eneste kilde til treningsanalyse.

## Prosjektstruktur

```text
Innesykkel/
├── assets/
│   └── innesykkel.icns
├── electron/
│   ├── main.js
│   ├── preload.js
│   └── picker-preload.js
├── index.html
├── package.json
├── workouts.json
└── README.md
```

Hoveddelen av brukergrensesnittet ligger i `index.html`. Electron-koden håndterer vinduer, Bluetooth-valg, lokal lagring og Intervals.icu-integrasjon.

## Status

Innesykkel er et personlig prosjekt under aktiv utvikling. Funksjoner, eksportformat og brukergrensesnitt kan endres.
