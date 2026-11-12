# Innesykkel

En personlig webapp for registrering og styring av innendørs sykkeltrening.

Innesykkel kjører direkte i nettleseren og bruker Bluetooth for å koble til kompatible treningsenheter og sensorer.

## Funksjoner

Appen støtter blant annet:

- Tilkobling til smarttrainer
- Wattmåling fra pedaler eller annen kraftsensor
- Pulsmåling
- CORE kroppstemperatursensor
- ERG modus
- Strukturerte treningsøkter
- Frie treningsøkter
- Runder og rundestatistikk
- Visning av watt, puls, kadens og andre treningsdata
- Grafisk visning av treningsøkten
- Beregning av normalisert watt og TSS
- Lagring av innstillinger i nettleseren
- Eksport av treningsdata

Appen kan eksportere treninger som FIT filer. Eksporten inneholder data fra tilgjengelige sensorer og informasjon om treningsøkten.

## Krav

For Bluetooth funksjonalitet trenger du en nettleser med støtte for Web Bluetooth.

Typiske enheter som kan brukes med appen er:

- Smarttrainer
- Wattpedaler eller annen Bluetooth kraftsensor
- Bluetooth pulssensor
- CORE temperatursensor

Tilgjengelige funksjoner avhenger av hvilke sensorer som er koblet til.

## Komme i gang

1. Last ned eller klon repositoryet.
2. Åpne `index.html` i en kompatibel nettleser.
3. Koble til ønskede Bluetooth enheter.
4. Angi FTP ved behov.
5. Velg en treningsøkt eller start en fri økt.
6. Start registreringen.

## Personlig prosjekt

Innesykkel er laget for personlig bruk. Appen er derfor ikke utviklet som en offentlig tjeneste eller et produkt for flere brukere.

## Prosjektstruktur

```text
Innesykkel/
├── index.html
└── README.md
```

For øyeblikket er hoveddelen av appen samlet i én HTML fil. Dette gjør det enkelt å starte og bruke prosjektet uten et eget byggesystem eller en server.

## Data og lagring

Appen lagrer enkelte innstillinger lokalt i nettleseren. Dette inkluderer blant annet FTP og konfigurasjon for enkelte funksjoner.

Treningsdata registreres under økten og kan eksporteres når treningen er ferdig.

## Status

Prosjektet er under personlig utvikling. Funksjoner og brukergrensesnitt kan endres etter behov.
