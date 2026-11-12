# RelaxedBuiten formulieren

Embedbare formulieren voor [relaxedbuiten.nl](https://relaxedbuiten.nl). Elke inzending gaat naar de n8n-workflow **RelaxedBuiten - Formulieren**. Die workflow:

1. logt de inzending in de n8n data table **RelaxedBuiten leads**;
2. mailt de aanvraag naar info@relaxedbuiten.nl (antwoorden gaat direct naar de klant);
3. stuurt de klant een bevestiging vanaf no-reply@relaxedbuiten.nl. Bij brochure- en offerteaanvragen zit de brochure als PDF in de bijlage.

## Plaatsen in Webflow

**1. Script één keer site-breed** (Site settings → Custom code → Footer):

```html
<script src="https://cdn.jsdelivr.net/gh/flitsdigital/relaxedbuiten@main/dist/rb-forms.min.js" defer></script>
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
| `brochure-mini` | Alleen e-mailadres + knop, voor de footer. Klant krijgt de brochure. |

### Opties (data-attributen)

| Attribuut | Voorbeeld | Effect |
|---|---|---|
| `data-title` | `data-title="Ontvang onze brochure"` | Andere kop |
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

Beschikbaar: `--rb-accent`, `--rb-accent-dark`, `--rb-bg`, `--rb-text`, `--rb-muted`, `--rb-line`, `--rb-error`, `--rb-radius`, `--rb-heading-font`.

### Conversies meten

Na een geslaagde inzending:

- `dataLayer.push({ event: 'rb_form_submit', rb_form: 'brochure', rb_form_type: 'brochure' })` voor GTM / Google Ads;
- een `rb-form:success` event op het element (`detail.form`, `detail.type`, `detail.interesse`).

UTM-parameters, `gclid` en `fbclid` worden automatisch meegestuurd.

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

Na een wijziging: commit, push en ververs de cache via `https://purge.jsdelivr.net/gh/flitsdigital/relaxedbuiten@main/dist/rb-forms.min.js`.
