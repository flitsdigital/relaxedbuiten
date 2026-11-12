# RelaxedBuiten formulieren

Embedbare formulieren voor [relaxedbuiten.nl](https://relaxedbuiten.nl). Elke inzending gaat naar de n8n-workflow **RelaxedBuiten - Formulieren**. Die workflow:

1. logt de inzending in de n8n data table **RelaxedBuiten leads**;
2. mailt de aanvraag naar info@relaxedbuiten.nl (antwoorden gaat direct naar de klant);
3. stuurt de klant een bevestiging vanaf no-reply@relaxedbuiten.nl. Bij brochure- en offerteaanvragen zit de brochure als PDF in de bijlage.

## Plaatsen in Webflow

**1. Script één keer site-breed** (Site settings → Custom code → Footer):

```html
<script src="https://cdn.jsdelivr.net/gh/flitsdigital/relaxedbuiten@a562e7d96d5d5009884d03db080a4e872d2fa2a0/dist/rb-forms.min.js" defer></script>
```

**2. Formulier plaatsen** met een *Embed*-element op de plek waar het formulier moet komen:

```html
<div data-rb-form="brochure"></div>
```

| Variant | Wat het is |
|---|---|
| `brochure` | 2 stappen: naam, e-mail, telefoon → interesse en woonplaats (optioneel). Klant krijgt de brochure. |
| `offerte` | 2 stappen: naam, e-mail, telefoon → interesse (verplicht) en vragen. Klant krijgt bevestiging + brochure. |
| `contact` | 1 stap: naam, e-mail, telefoon (optioneel) en bericht. |
| `offerte-hero` | Voornaam, e-mail en telefoon + knop op één regel, voor in de hero (op mobiel onder elkaar). Telt als offerteaanvraag: klant krijgt bevestiging + brochure. |
| `brochure-mini` | Alleen e-mailadres + knop, voor de footer. Klant krijgt de brochure. |

### Opties (data-attributen)

| Attribuut | Voorbeeld | Effect |
|---|---|---|
| `data-title` | `data-title="Ontvang onze brochure"` of `data-title=""` | Andere kop, of geen kop |
| `data-card` | `data-card="false"` | Geen grijze kaart: alleen velden en knop, links uitgelijnd. Voor in een bestaande layout (bijv. de contactpagina) |
| `data-subtitle` | `data-subtitle=""` | Andere (of geen) ondertitel |
| `data-button` | `data-button="Verstuur"` | Andere tekst op de verstuurknop |
| `data-interesse` | `data-interesse="hottub"` | Interesse alvast aangevinkt (handig op productpagina's). Meerdere: `hottub,sauna` |
| `data-redirect` | `data-redirect="/bedankt-brochure"` | Na verzenden doorsturen naar een bedankpagina |
| `data-image` | `data-image="https://…/cover.png"` of `false` | Andere brochure-afbeelding, of geen |

### Kleuren aanpassen

Het formulier zit in een Shadow DOM, dus Webflow-CSS heeft er geen invloed op. Aanpassen kan met CSS-variabelen op het element:

```html
<div data-rb-form="brochure-mini" style="--rb-text:#fff;--rb-muted:#cfd8cf"></div>
```

Beschikbaar: `--rb-accent`, `--rb-accent-dark`, `--rb-bg`, `--rb-text`, `--rb-muted`, `--rb-line`, `--rb-error`, `--rb-radius`, `--rb-heading-font`, plus `--rb-field-text` en `--rb-field-bg` voor de invoervelden (die blijven standaard donker op wit, ook als `--rb-text` wit is).

### Knoppen in de huisstijl

De knoppen gebruiken de Webflow-variabelen van de site, net als `.button`: `--_primitives---colors--persimmon` (achtergrond), `--_primitives---colors--white` (tekst) en `--_typography---font-styles--heading` (lettertype). Wijzig je die variabelen in Webflow, dan veranderen de knoppen mee. Zonder die variabelen valt het formulier terug op zalm met donkere tekst. Overschrijven kan per formulier met `--rb-btn-bg`, `--rb-btn-text` en `--rb-btn-font`.

### Conversies meten (GTM)

Het component zet deze events in de `dataLayer`:

| Event | Wanneer | Velden |
|---|---|---|
| `rb_form_start` | Eerste invoer in een formulier | `rb_form`, `rb_form_type` |
| `rb_form_step` | Naar stap 2 | + `rb_step` |
| `rb_form_error` | Validatiefout | + `rb_field`, `rb_step` |
| `rb_form_submit` | Geslaagde inzending | + `rb_interest`, `user_data` (e-mail, telefoon in +31-formaat, voor- en achternaam) |

`rb_form_type` is `brochure`, `offerte`, `contact` of `configurator`. De Webflow-formulieren met "aanvraag" in de naam (de configurators) melden zich ook, zodra Webflow het succesbericht toont, als `configurator-hottub`, `configurator-sauna` of `configurator-jacuzzi`. Bij `data-redirect` wacht het formulier tot GTM klaar is (max. 1,5 s).

`gtm/relaxedbuiten-gtm-import.json` is een GTM-container om te importeren (Admin → Import container) met GA4 (`generate_lead`, `aanvraag_<type>`, `formulier_gestart`, `formulier_stap`, `formulier_fout`, `contact_klik`) en de Meta Pixel. Alles vuurt pas na toestemming via de Flits-cookiebanner (`consent_update`). Vul na het importeren het GA4 Measurement ID in de variabele `C - GA4 Measurement ID` in.

**Privacy:** UTM-parameters gaan altijd mee met een inzending. `gclid`/`fbclid` en het bewaren van campagnegegevens tussen pagina's gebeuren alleen met toestemming voor marketing (`localStorage.relaxedbuiten_consent`, instelbaar via `RBFormsConfig.consentKey`).

## Bestaande Webflow-formulieren koppelen

De bestaande Webflow-formulieren (offerte, contact, brochure en de configurators voor hottub, sauna en jacuzzi) kunnen ook via deze workflow lopen. Voeg in Webflow onder **Site settings → Apps & integrations → Webhooks** een *Form submission*-webhook toe naar:

```
https://flitsdigital01.app.n8n.cloud/webhook/relaxedbuiten-formulieren
```

De workflow herkent het formulier aan de naam en zet de velden zelf om.

## Bestanden

- `rb-forms.js`: broncode, zonder build-stap te bewerken
- `dist/rb-forms.min.js`: geminificeerd, deze wordt geladen (`npx terser rb-forms.js -c -m --comments '/^!/' -o dist/rb-forms.min.js`)
- `brochure/`: brochure-PDF en coverafbeelding
- `demo/index.html`: alle varianten op één pagina. Lokaal openen verstuurt niets; voeg `?live=1` toe om echt te versturen.
- `demo/states.html`: elke stap en state (leeg, fouten, ingevuld, versturen, mislukt, gelukt, mobiel) met testdata.

Per formulier kun je met `data-webhook="https://…"` een andere webhook gebruiken, bijvoorbeeld een testworkflow.

Na een wijziging: verhoog `version` in `rb-forms.js`, bouw de min-versie, commit, en zet de nieuwe commit-hash (of een GitHub-release-tag) in de script-URL in Webflow. Een vaste commit of tag wordt nooit uit een verouderde cache geladen; `@main` kan tot 12 uur oud zijn.
