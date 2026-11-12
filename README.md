# Innesykkel

Innesykkel er en nettleserbasert app for registrering og styring av innendørs sykkeltrening. Appen er laget for personlig bruk og samler treningsdata fra en smarttrainer og tilkoblede sensorer.

Appen kjører i én HTML-fil. Den krever ikke et eget byggesystem, en backend eller en database.

## Funksjoner

### Trening

- Fri tur med eller uten fast wattmål.
- Treningsøkter med import av `.zwo`- og `.mrc`-filer.
- Pulsbasert ERG-modus som justerer motstanden for å holde pulsen innenfor et valgt område.
- Vanlig ERG-styring på kompatibel smarttrainer.
- Visning av watt, puls, kadens, fart, kjernetemperatur og hudtemperatur.
- Graf for watt og puls, med visning av treningssteg.
- Manuelle runder, rundestatistikk og hurtigtaster.
- Gjenoppretting av en økt hvis nettleseren lukkes eller siden lastes inn på nytt.

### Treningsdata og analyse

Appen viser blant annet:

- Normalisert watt (NP).
- Training Stress Score (TSS).
- Effektivitetsfaktor (EF).
- Gjennomsnittlig og maksimal puls.
- Distanse og akkumulert arbeid i kJ.

Beregningene er ment som treningsinformasjon. Verdiene kan avvike fra andre treningsplattformer, særlig hvis datagrunnlaget eller beregningsmetoden er forskjellig.

### Eksport

Etter en økt kan du eksportere data i disse formatene:

| Format | Innhold |
| --- | --- |
| FIT | Treningsdata, runder, sensorverdier og øktinformasjon. Kan også inneholde en syntetisk GPS-rute. |
| TCX | Grunnleggende treningsdata med tid, puls, kadens, watt og kjernetemperatur. |
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

## Krav til nettleser

Du trenger en nettleser som støtter Web Bluetooth. Bruk en oppdatert versjon av Chrome på en støttet datamaskin eller Android-enhet. På iPad kan en egen nettleser med Web Bluetooth-støtte, for eksempel Bluefy, være nødvendig.

Web Bluetooth krever en sikker kontekst. Bruk HTTPS eller en lokal utviklingsserver på localhost. Vanlig HTTP på andre adresser støttes ikke.

Nettleseren må ha tilgang til Bluetooth. Du må også godkjenne tilkobling til hver sensor.

## Komme i gang

1. Åpne appen i en nettleser som støtter Web Bluetooth.
2. Koble til smarttrainer og sensorer med knappene øverst i appen.
3. Angi FTP. Appen bruker FTP i treningsberegninger og ERG-styring.
4. Velg Fri tur, Treningsøkt eller Puls-ERG.
5. Hvis du velger Treningsøkt, last inn en `.zwo`- eller `.mrc`-fil.
6. Start økten.
7. Når økten er ferdig, åpner du øktsammendraget og velger ønsket eksportformat.

Du kan koble til bare sensorene du trenger. Appen viser ikke målinger som sensoren ikke leverer.

## Data og personvern

Appen kjører lokalt i nettleseren. Innstillinger som FTP, modusvalg og Puls-ERG-konfigurasjon lagres i nettleserens lokale lagring.

En aktiv økt lagres også lokalt slik at appen kan tilby gjenoppretting etter en avbrutt økt. Eksporterte filer lastes ned til enheten din.

Appen har ingen egen server eller brukerkonto. Data som du importerer eller registrerer, sendes ikke til en Innesykkel-backend.

## Kjente begrensninger

- Web Bluetooth fungerer ikke i alle nettlesere eller innebygde nettleservisninger.
- Bluetooth-tilkobling og sensordata avhenger av operativsystem, nettleser og enhet.
- CORE-data som faktisk er implementert, omfatter kjernetemperatur og hudtemperatur. HSI (Heat Strain Index) er foreløpig ikke lest fra Bluetooth-pakken. HSI-feltet finnes i eksportstrukturen, men vil være tomt til parsing er implementert.
- FIT-filen bruker Garmin-relaterte metadata og felt, men er ikke en garanti for identisk oppførsel med en ekte Garmin Edge-enhet.
- Virtuell GPS er beregnet og skal ikke brukes som dokumentasjon på faktisk posisjon eller tilbakelagt utendørs rute.
- Prosjektet er under utvikling. Kontroller eksportfilene før du bruker dem som eneste kilde til treningsanalyse.

## Prosjektstruktur

```text
Innesykkel/
├── index.html
└── README.md
```

Hoveddelen av appen ligger i `index.html`. Det finnes ikke et eget byggesteg eller en pakkehåndtering som må kjøres.

## Status

Innesykkel er et personlig prosjekt under aktiv utvikling. Funksjoner, eksportformat og brukergrensesnitt kan endres.
