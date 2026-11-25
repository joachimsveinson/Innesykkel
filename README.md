# Innesykkel

Innesykkel er en nettleserbasert app for innendørs sykkeltrening. Appen kjører fra `index.html` og bruker Web Bluetooth for å koble til smarttrainer og sensorer.

## Bruk

Åpne appen fra en sikker HTTPS adresse i en nettleser som støtter Web Bluetooth. På iPad kan du bruke Bluefy. Bluetooth krever at nettleseren støtter Web Bluetooth og at siden har tillatelse til å bruke Bluetooth.

Du kan også åpne `index.html` lokalt for å se grensesnittet. For å laste øktbiblioteket må nettleseren kunne hente `workouts.json`, så bruk en lokal webserver eller publiser filene på HTTPS.

## Funksjoner

- Fri tur og treningsøkter med ZWO og MRC import.
- 26 forhåndslagrede treningsøkter.
- ERG styring på kompatible smarttrainere.
- Pulsbasert ERG.
- Watt, puls, kadens, fart, kjernetemperatur og hudtemperatur.
- Analyse med NP, TSS, IF, EF, pulssoner og effektsoner.
- FIT, TCX og CSV eksport.
- Lagring og gjenoppretting av aktive økter.
- Bluetooth tilkobling til smarttrainer, wattpedaler, pulssensor og CORE sensor.

## Intervals.icu

Intervals.icu kalenderintegrasjon er ikke aktivert i denne nettleserversjonen. Den tidligere implementasjonen var avhengig av Electron og macOS nøkkellagring. Den må bygges om og testes for nettlesere før den kan brukes trygt på PC og iPad. API nøkkelen skal ikke lagres ukryptert i nettleseren.

## Bluetooth

Web Bluetooth har ulike begrensninger mellom nettlesere og enheter. Test tilkobling, gjenoppkobling og sensordata i Bluefy på iPad før du bruker appen til en treningsøkt.

## Personvern

Treningsdata lagres lokalt i nettleseren. Eksporterte filer lagres på enheten din. Appen krever ikke en egen backend eller database.
