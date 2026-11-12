/*!
 * RelaxedBuiten formulieren — embedbaar formuliercomponent
 * Gebruik: <div data-rb-form="brochure"></div>
 *          <script src="https://cdn.jsdelivr.net/gh/flitsdigital/relaxedbuiten@main/dist/rb-forms.min.js" defer></script>
 * Varianten: brochure | offerte | contact | brochure-mini
 * Docs: https://github.com/flitsdigital/relaxedbuiten
 */
(function () {
  'use strict';
  if (window.RBForms && window.RBForms.__loaded) return;

  var CDN = 'https://cdn.jsdelivr.net/gh/flitsdigital/relaxedbuiten@main/';
  var CONFIG = Object.assign({
    webhook: 'https://flitsdigital01.app.n8n.cloud/webhook/relaxedbuiten-formulieren',
    brochureImage: CDN + 'brochure/cover.jpg',
    privacyUrl: '/privacy-beleid',
    phone: '+31657109638',
    phoneLabel: '06 57 10 96 38'
  }, window.RBFormsConfig || {});

  var INTERESSES = ['Hottub', 'Sauna', 'Jacuzzi', 'Wellness huisje'];

  /* ---------- Formulierdefinities ---------- */
  var FORMS = {
    brochure: {
      title: 'Gratis brochure aanvragen',
      stepTitles: ['Uw gegevens', 'Uw interesse'],
      image: true,
      submit: 'Stuur mij de brochure',
      success: { title: 'De brochure is onderweg!', text: 'Check uw mailbox: binnen een minuut heeft u onze brochure met alle hottubs, sauna\'s en spa\'s.' },
      steps: [
        [
          { row: [{ name: 'voornaam', label: 'Voornaam', required: true, autocomplete: 'given-name' },
                  { name: 'achternaam', label: 'Achternaam', autocomplete: 'family-name' }] },
          { name: 'email', label: 'Uw e-mailadres', type: 'email', required: true, placeholder: 'naam@voorbeeld.nl', icon: 'mail', autocomplete: 'email' },
          { name: 'telefoon', label: 'Uw telefoonnummer', type: 'tel', placeholder: '+31 6 1234567', icon: 'phone', autocomplete: 'tel' }
        ],
        [
          { name: 'interesse', label: 'Waar heeft u interesse in?', hint: 'Meerdere opties mogelijk', type: 'chips', options: INTERESSES },
          { name: 'woonplaats', label: 'Uw woonplaats', placeholder: 'Bijv. Ruinen', autocomplete: 'address-level2' }
        ]
      ]
    },
    offerte: {
      title: 'Vrijblijvende offerte aanvragen',
      stepTitles: ['Uw gegevens', 'Uw wensen'],
      subtitle: 'Wij adviseren u graag en nemen binnen 2 werkdagen contact met u op.',
      submit: 'Offerte aanvragen',
      success: { title: 'Bedankt voor uw aanvraag!', text: 'We nemen binnen 2 werkdagen contact met u op. Onze brochure is alvast naar uw mailbox gestuurd.' },
      steps: [
        [
          { name: 'naam', label: 'Naam', required: true, autocomplete: 'name' },
          { name: 'email', label: 'E-mailadres', type: 'email', required: true, placeholder: 'naam@voorbeeld.nl', icon: 'mail', autocomplete: 'email' },
          { name: 'telefoon', label: 'Telefoonnummer', type: 'tel', required: true, placeholder: '+31 6 1234567', icon: 'phone', autocomplete: 'tel' }
        ],
        [
          { name: 'interesse', label: 'Waar heeft u interesse in?', hint: 'Meerdere opties mogelijk', type: 'chips', options: INTERESSES, required: true },
          { name: 'bericht', label: 'Heeft u nog vragen of opmerkingen?', type: 'textarea', placeholder: 'Bijv. gewenste maat, levering of plaatsing' }
        ]
      ]
    },
    contact: {
      title: 'Neem contact op',
      subtitle: 'Wij reageren binnen 2 werkdagen.',
      submit: 'Bericht versturen',
      success: { title: 'Bedankt voor uw bericht!', text: 'We reageren binnen 2 werkdagen. Een kopie van uw bericht staat in uw mailbox.' },
      steps: [
        [
          { name: 'naam', label: 'Naam', required: true, autocomplete: 'name' },
          { row: [{ name: 'email', label: 'E-mailadres', type: 'email', required: true, placeholder: 'naam@voorbeeld.nl', autocomplete: 'email' },
                  { name: 'telefoon', label: 'Telefoonnummer', type: 'tel', placeholder: '+31 6 1234567', autocomplete: 'tel' }] },
          { name: 'bericht', label: 'Bericht', type: 'textarea', required: true, placeholder: 'Waar kunnen we u mee helpen?' }
        ]
      ]
    },
    'brochure-mini': {
      formType: 'brochure',
      compact: true,
      title: 'Benieuwd naar ons hele assortiment?',
      subtitle: 'Download nu de gratis brochure.',
      submit: 'Download',
      success: { title: 'Gelukt!', text: 'De brochure staat binnen een minuut in uw mailbox.' },
      steps: [[{ name: 'email', label: 'Uw e-mailadres', type: 'email', required: true, placeholder: 'Uw e-mailadres hier', icon: 'mail', autocomplete: 'email', hideLabel: true }]]
    }
  };

  /* ---------- Iconen ---------- */
  var ICONS = {
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'
  };

  /* Interesse-iconen (stroke via CSS, zodat de kleur meegaat met de staat) */
  var INTEREST_ICONS = {
    'Hottub': '<path d="M2 11H22"/><path d="M4 11V20H20V11"/><path d="M8 14V17M12 14V17M16 14V17"/><path d="M7.5 8C7.5 7 8.5 6 8.5 5C8.5 4 7.5 4 7.5 3M11.5 8C11.5 7 12.5 6 12.5 5C12.5 4 11.5 4 11.5 3M15.5 8C15.5 7 16.5 6 16.5 5C16.5 4 15.5 4 15.5 3"/>',
    'Sauna': '<path d="M4 20V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V20"/><path d="M2 20H22"/><path d="M10 20V14H14V20"/><circle cx="12" cy="9.5" r="1.5"/>',
    'Jacuzzi': '<path d="M2 16Q4.5 14 7 16T12 16T17 16T22 16"/><path d="M2 20Q4.5 18 7 20T12 20T17 20T22 20"/><circle cx="8" cy="9.5" r="2.5"/><circle cx="14" cy="4.5" r="2"/><circle cx="16.5" cy="10.5" r="1.5"/>',
    'Wellness huisje': '<path d="M4 20V10L12 4L20 10V20"/><path d="M2 20H22"/><path d="M12 10.5C12 10.5 9.5 13.2 9.5 15C9.5 16.3807 10.6193 17.5 12 17.5C13.3807 17.5 14.5 16.3807 14.5 15C14.5 13.2 12 10.5 12 10.5Z"/>'
  };
  function interestIcon(name) {
    var d = INTEREST_ICONS[name];
    return d ? '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>' : '';
  }

  /* ---------- Styles (in Shadow DOM, dus geen botsing met Webflow-CSS) ---------- */
  var CSS = [
    ':host{--rb-accent:#F99786;--rb-accent-dark:#ef7f6a;--rb-bg:#f2f2f2;--rb-text:#111;--rb-muted:#6b6b6b;--rb-line:#d9d9d9;--rb-error:#d64545;--rb-radius:28px;--rb-field-text:#111;--rb-field-bg:#fff;',
    '--rb-heading-font:Montserrat,system-ui,sans-serif;display:block;font-family:inherit;color:var(--rb-text);color-scheme:light}',
    '*,*::before,*::after{box-sizing:border-box}',
    '.wrap{container-type:inline-size}',
    /* kaart: padding schaalt mee met de breedte van het formulier */
    '.card{background:var(--rb-bg);border-radius:var(--rb-radius);padding:28px 22px;max-width:560px;margin:0 auto}',
    '@container (min-width:440px){.card{padding:40px}}',
    '@container (min-width:540px){.card{padding:48px}}',
    '.compact .card{max-width:none;padding:0;background:transparent}',
    /* data-card="false": alleen velden en knop, voor in een bestaande layout */
    '.plain .card{max-width:none;padding:0;background:transparent;border-radius:0}',
    '.plain .head{text-align:left}',
    '.plain .actions{flex-direction:row;justify-content:flex-start}',
    '.plain .legal{text-align:left}',
    /* stappen */
    '.progress{height:4px;background:#d6d6d6;border-radius:4px;overflow:hidden;margin:0 0 12px}',
    '.progress span{display:block;height:100%;background:var(--rb-accent);border-radius:4px;transition:width .35s ease}',
    '.stepnr{font-size:14px;color:var(--rb-muted);margin:0 0 24px}',
    '.stepnr b{color:var(--rb-text);font-weight:600}',
    /* kop */
    '.head{margin:0 0 28px;text-align:center}',
    'h2{font-family:var(--rb-heading-font);font-weight:700;font-size:30px;font-size:clamp(24px,7.2cqi,34px);line-height:1.18;margin:0;letter-spacing:-.01em;text-wrap:balance}',
    '.sub{color:var(--rb-muted);margin:10px 0 0;line-height:1.5;font-size:15px;text-wrap:balance}',
    '.cover{display:block;width:132px;height:auto;margin:-4px auto 36px;transform:perspective(600px) rotateX(18deg) rotateZ(-16deg);box-shadow:-10px 14px 22px rgba(0,0,0,.22);border-radius:3px}',
    /* velden: één ritme van 20px, ook als een rij onder elkaar valt */
    '.fields{display:grid;gap:20px}',
    '.row{display:grid;grid-template-columns:1fr;gap:20px 16px}',
    /* naast elkaar pas vanaf 500px; subgrid houdt labels, velden en foutmeldingen op één lijn */
    '@container (min-width:500px){.row{grid-template-columns:1fr 1fr;row-gap:0}.row>.field{display:grid;grid-template-rows:subgrid;grid-row:span 3;row-gap:0;align-content:start}.row>.field>.l{align-self:end}}',
    '.field{margin:0;min-width:0}',
    'fieldset.field{border:0;padding:0}',
    '.l{display:block;font-size:16px;line-height:1.3;margin:0 0 8px;padding:0}',
    '.opt{color:var(--rb-muted);font-size:14px}',
    '.hint{font-size:13px;color:var(--rb-muted);margin:-2px 0 10px}',
    '.ctrl{position:relative}',
    '.ctrl svg{position:absolute;left:18px;top:50%;width:20px;height:20px;transform:translateY(-50%);fill:none;stroke:var(--rb-field-text);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}',
    'input[type=text],input[type=email],input[type=tel],textarea{display:block;width:100%;font:inherit;font-size:16px;line-height:1.4;color:var(--rb-field-text);caret-color:var(--rb-field-text);background:var(--rb-field-bg);border:1px solid var(--rb-line);border-radius:999px;padding:0 20px;height:48px;outline:none;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none;appearance:none}',
    '.has-icon input{padding-left:50px}',
    'textarea{height:auto;min-height:128px;padding:14px 20px;border-radius:24px;resize:vertical;line-height:1.5}',
    'input::placeholder,textarea::placeholder{color:#9a9a9a}',
    'input:focus,textarea:focus{border-color:var(--rb-accent);box-shadow:0 0 0 3px rgba(249,151,134,.25)}',
    '.invalid input,.invalid textarea{border-color:var(--rb-error)}',
    '.err{color:var(--rb-error);font-size:13px;line-height:1.4;margin:6px 0 0 20px}',
    '.err:empty{display:none}',
    /* chips */
    '.chips{display:grid;grid-template-columns:1fr;gap:8px}',
    '@container (min-width:400px){.chips{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '.chip{min-width:0}',
    '.chip{position:relative}',
    '.chip input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}',
    '.chip span{display:flex;width:100%;align-items:center;gap:10px;min-height:48px;padding:0 14px;white-space:nowrap;border-radius:999px;border:1px solid var(--rb-line);background:var(--rb-field-bg);color:var(--rb-field-text);font-size:15px;cursor:pointer;transition:background .15s,border-color .15s}',
    '.chip .ic{width:22px;height:22px;flex:none;fill:none;stroke:var(--rb-accent-dark);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;transition:stroke .15s}',
    '.chip:hover span{border-color:var(--rb-accent)}',
    '.chip input:checked+span{background:var(--rb-accent);border-color:var(--rb-accent)}',
    '.chip input:checked+span .ic{stroke:#111}',
    '.chip input:focus-visible+span{box-shadow:0 0 0 3px rgba(249,151,134,.4)}',
    '.invalid .chip span{border-color:var(--rb-error)}',
    /* acties */
    '.legal{font-size:13px;line-height:1.5;color:var(--rb-muted);margin:24px 0 0}',
    '.legal a{color:inherit}',
    '.actions{display:flex;flex-direction:row-reverse;align-items:center;justify-content:space-between;gap:12px;margin-top:24px}',
    '.legal+.actions{margin-top:16px}',
    'button{font:inherit;cursor:pointer;border:0;margin:0}',
    '.btn{background:var(--rb-accent);color:#111;font-weight:700;font-size:16px;min-height:48px;padding:0 30px;border-radius:999px;white-space:nowrap;transition:background .15s,transform .1s;display:inline-flex;align-items:center;justify-content:center;gap:10px}',
    '.btn:hover{background:var(--rb-accent-dark)}',
    '.btn:active{transform:translateY(1px)}',
    '.btn:focus-visible,.back:focus-visible{outline:2px solid var(--rb-text);outline-offset:3px}',
    '.btn[disabled]{cursor:wait;background:var(--rb-accent)}',
    '.btn .spin{width:16px;height:16px;border:2px solid rgba(0,0,0,.25);border-top-color:#111;border-radius:50%;animation:s .7s linear infinite}',
    '@keyframes s{to{transform:rotate(360deg)}}',
    '.back{background:none;color:var(--rb-text);display:inline-flex;align-items:center;gap:4px;font-size:15px;min-height:44px;padding:0 4px;border-radius:8px}',
    '.back svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2}',
    '@container (max-width:420px){.actions{flex-direction:column;align-items:stretch;gap:4px}.actions .btn{width:100%}.back{align-self:center}.legal,.formerr{text-align:center}}',
    '.formerr{color:var(--rb-error);font-size:14px;line-height:1.5;margin:12px 0 0}',
    /* bedankt */
    '.formerr a{color:inherit;font-weight:600;white-space:nowrap}',
    '.done{text-align:center;padding:8px 0}',
    '.done .tick{width:64px;height:64px;border-radius:50%;background:var(--rb-accent);display:grid;place-items:center;margin:0 auto 20px}',
    '.done .tick svg{width:30px;height:30px;fill:none;stroke:#111;stroke-width:2.6}',
    '.done p{color:var(--rb-muted);line-height:1.55;margin:12px 0 0;text-wrap:balance}',
    '.hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}',
    /* compact (footer) */
    '.compact .head{text-align:left;margin-bottom:16px}',
    '.compact h2{font-size:22px}',
    '.compact .sub{margin-top:4px}',
    '.inline{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-start}',
    '.inline .field{flex:1 1 240px}',
    '.inline .btn{flex:none}',
    '@container (max-width:420px){.inline .btn{width:100%}}',
    '.compact .legal{margin-top:10px}',
    '.compact .done{text-align:left;display:flex;gap:14px;align-items:center}.compact .done .tick{margin:0;width:44px;height:44px;flex:none}.compact .done .tick svg{width:22px;height:22px}.compact .done p{margin:2px 0 0}',
    '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'
  ].join('');

  /* ---------- Hulpfuncties ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var uid = 0;

  function readUtm() {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    var out = {};
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem('rb_utm') || '{}'); } catch (e) { stored = {}; }
    var params = new URLSearchParams(location.search);
    keys.forEach(function (k) { var v = params.get(k) || stored[k]; if (v) out[k] = v; });
    try { sessionStorage.setItem('rb_utm', JSON.stringify(out)); } catch (e) { /* geen storage */ }
    return out;
  }
  var UTM = readUtm();

  function fieldHtml(f, id) {
    if (f.row) return '<div class="row">' + f.row.map(function (r) { return fieldHtml(r, id); }).join('') + '</div>';
    var fid = 'rb' + id + '-' + f.name;
    var req = f.required ? '' : ' <span class="opt">(optioneel)</span>';
    if (f.type === 'chips') {
      return '<fieldset class="field" data-f="' + f.name + '"><legend class="l">' + esc(f.label) + req + '</legend>' +
        (f.hint ? '<p class="hint">' + esc(f.hint) + '</p>' : '') + '<div class="chips">' +
        f.options.map(function (o) { return '<label class="chip"><input type="checkbox" name="' + f.name + '" value="' + esc(o) + '"><span>' + interestIcon(o) + esc(o) + '</span></label>'; }).join('') +
        '</div><p class="err" role="alert"></p></fieldset>';
    }
    var input = f.type === 'textarea'
      ? '<textarea id="' + fid + '" name="' + f.name + '"' + (f.required ? ' required' : '') + ' placeholder="' + esc(f.placeholder || '') + '"></textarea>'
      : '<input id="' + fid + '" name="' + f.name + '" type="' + (f.type || 'text') + '"' + (f.required ? ' required' : '') +
        (f.autocomplete ? ' autocomplete="' + f.autocomplete + '"' : '') + (f.type === 'email' ? ' inputmode="email"' : '') +
        ' placeholder="' + esc(f.placeholder || '') + '">';
    return '<div class="field" data-f="' + f.name + '"><label class="' + (f.hideLabel ? 'sr' : 'l') + '" for="' + fid + '">' + esc(f.label) + req + '</label>' +
      '<div class="ctrl' + (f.icon ? ' has-icon' : '') + '">' + (f.icon ? ICONS[f.icon] : '') + input + '</div><p class="err" role="alert"></p></div>';
  }

  function flatFields(step) {
    var out = [];
    step.forEach(function (f) { if (f.row) out = out.concat(f.row); else out.push(f); });
    return out;
  }

  /* ---------- Component ---------- */
  function mount(host) {
    if (host.__rbMounted) return;
    var variant = (host.getAttribute('data-rb-form') || 'brochure').toLowerCase();
    var def = FORMS[variant];
    if (!def) { console.warn('[RBForms] Onbekende variant:', variant); return; }
    host.__rbMounted = true;
    var id = ++uid;
    var ds = host.dataset;
    var title = ds.title !== undefined ? ds.title : def.title;
    var plain = ds.card === 'false';
    var subtitle = ds.subtitle !== undefined ? ds.subtitle : (def.subtitle || '');
    var submitLabel = ds.button || def.submit;
    var redirect = ds.redirect || '';
    var preselect = (ds.interesse || '').toLowerCase().split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var showImage = def.image && ds.image !== 'false';
    var image = ds.image && ds.image !== 'false' ? ds.image : CONFIG.brochureImage;
    var steps = def.steps;
    var current = 0;
    var formType = def.formType || variant;

    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    root.innerHTML = '<style>' + CSS + '</style><div class="wrap' + (def.compact ? ' compact' : '') + (plain ? ' plain' : '') + '"><div class="card"></div></div>';
    var card = root.querySelector('.card');

    var values = {};

    function render() {
      var multi = steps.length > 1;
      var html = '';
      if (multi) {
        var stepTitle = def.stepTitles && def.stepTitles[current] ? ' · ' + esc(def.stepTitles[current]) : '';
        html += '<div class="progress" aria-hidden="true"><span style="width:' + ((current + 1) / steps.length * 100) + '%"></span></div>' +
          '<p class="stepnr"><b>Stap ' + (current + 1) + ' van ' + steps.length + '</b>' + stepTitle + '</p>';
      }
      if (title || (subtitle && current === 0)) html += '<div class="head">' + (title ? '<h2>' + esc(title) + '</h2>' : '') + (subtitle && current === 0 ? '<p class="sub">' + esc(subtitle) + '</p>' : '') + '</div>';
      if (showImage && current === 0) html += '<img class="cover" src="' + esc(image) + '" alt="Brochure RelaxedBuiten" width="132" height="171" loading="lazy">';
      html += '<form novalidate>';
      html += '<div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>';
      var isLast = current === steps.length - 1;
      var legal = '<p class="legal">Door te versturen gaat u akkoord met ons <a href="' + esc(CONFIG.privacyUrl) + '" target="_blank" rel="noopener">privacybeleid</a>.</p>';
      if (def.compact) {
        html += '<div class="inline">' + steps[current].map(function (f) { return fieldHtml(f, id); }).join('') +
          '<button class="btn" type="submit">' + esc(submitLabel) + '</button></div>' + legal;
      } else {
        html += '<div class="fields">' + steps[current].map(function (f) { return fieldHtml(f, id); }).join('') + '</div>';
        if (isLast) html += legal;
        html += '<div class="actions">' +
          '<button class="btn" type="submit">' + esc(isLast ? submitLabel : 'Volgende') + '</button>' +
          (current > 0 ? '<button type="button" class="back">' + ICONS.back + 'Terug</button>' : '') + '</div>';
      }
      html += '<div class="formerr" hidden role="alert"></div></form>';
      card.innerHTML = html;
      restore();
      var form = card.querySelector('form');
      form.addEventListener('submit', onSubmit);
      form.addEventListener('input', function (e) { var fld = e.target.closest('.field'); if (fld) setErr(fld, ''); });
      var back = card.querySelector('.back');
      if (back) back.addEventListener('click', function () { collect(); current--; render(); focusFirst(); });
    }

    function restore() {
      flatFields(steps[current]).forEach(function (f) {
        var els = card.querySelectorAll('[name="' + f.name + '"]');
        if (f.type === 'chips') {
          var sel = values[f.name] || preselect;
          els.forEach(function (el) { el.checked = sel.indexOf(el.value.toLowerCase()) > -1 || sel.indexOf(el.value) > -1; });
        } else if (els[0] && values[f.name]) {
          els[0].value = values[f.name];
        }
      });
    }

    function collect() {
      flatFields(steps[current]).forEach(function (f) {
        var els = card.querySelectorAll('[name="' + f.name + '"]');
        if (f.type === 'chips') values[f.name] = Array.prototype.filter.call(els, function (el) { return el.checked; }).map(function (el) { return el.value; });
        else if (els[0]) values[f.name] = els[0].value.trim();
      });
      var hp = card.querySelector('[name="website"]');
      if (hp && hp.value) values.website = hp.value;
    }

    function setErr(fld, msg) {
      fld.classList.toggle('invalid', !!msg);
      var e = fld.querySelector('.err');
      if (e) e.textContent = msg;
    }

    function validate() {
      var ok = true;
      var first = null;
      flatFields(steps[current]).forEach(function (f) {
        var fld = card.querySelector('[data-f="' + f.name + '"]');
        var v = values[f.name];
        var msg = '';
        if (f.type === 'chips') { if (f.required && (!v || !v.length)) msg = 'Kies minimaal één optie.'; }
        else if (f.required && !v) msg = 'Dit veld is verplicht.';
        else if (v && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Vul een geldig e-mailadres in.';
        else if (v && f.type === 'tel' && v.replace(/\D/g, '').length < 9) msg = 'Vul een geldig telefoonnummer in.';
        if (fld) setErr(fld, msg);
        if (msg) { ok = false; if (!first && fld) first = fld; }
      });
      if (first) { var inp = first.querySelector('input,textarea'); if (inp) inp.focus(); }
      return ok;
    }

    function focusFirst() { var i = card.querySelector('input:not([tabindex="-1"]),textarea'); if (i) try { i.focus({ preventScroll: true }); } catch (e) { i.focus(); } }

    function onSubmit(e) {
      e.preventDefault();
      collect();
      if (!validate()) return;
      if (current < steps.length - 1) { current++; render(); focusFirst(); return; }
      send();
    }

    function send() {
      var btn = card.querySelector('.btn');
      var errBox = card.querySelector('.formerr');
      errBox.hidden = true;
      btn.disabled = true;
      btn.innerHTML = '<span class="spin"></span>Versturen…';

      var body = new URLSearchParams();
      body.append('form', variant);
      body.append('type', formType);
      body.append('pagina', location.href.split('#')[0]);
      body.append('referrer', document.referrer || '');
      Object.keys(values).forEach(function (k) {
        var v = values[k];
        if (Array.isArray(v)) v = v.join(', ');
        if (typeof v === 'boolean') v = v ? 'ja' : '';
        if (v) body.append(k, v);
      });
      Object.keys(UTM).forEach(function (k) { body.append(k, UTM[k]); });

      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);

      fetch(host.getAttribute('data-webhook') || CONFIG.webhook, { method: 'POST', body: body, signal: ctrl ? ctrl.signal : undefined, mode: 'cors' })
        .then(function (r) {
          clearTimeout(timer);
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || j.ok === false) throw new Error(j.error || 'Versturen mislukt');
            return j;
          });
        })
        .then(function () { success(); })
        .catch(function (err) {
          clearTimeout(timer);
          btn.disabled = false;
          btn.textContent = submitLabel;
          var msg = err && err.message && err.message !== 'Failed to fetch' && err.name !== 'AbortError' && err.message !== 'Versturen mislukt' ? err.message + ' ' : '';
          errBox.innerHTML = esc(msg) + 'Er ging iets mis bij het versturen. Probeer het opnieuw of bel ons op <a href="tel:' + esc(CONFIG.phone) + '">' + esc(CONFIG.phoneLabel) + '</a>.';
          errBox.hidden = false;
        });
    }

    function success() {
      var detail = { form: variant, type: formType, interesse: (values.interesse || []).join(', ') };
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'rb_form_submit', rb_form: variant, rb_form_type: formType });
      } catch (e) { /* geen dataLayer */ }
      host.dispatchEvent(new CustomEvent('rb-form:success', { detail: detail, bubbles: true, composed: true }));
      if (redirect) { location.href = redirect; return; }
      card.innerHTML = '<div class="done" role="status"><div class="tick">' + ICONS.check + '</div><div><h2>' + esc(def.success.title) + '</h2><p>' + esc(def.success.text) + '</p></div></div>';
    }

    render();
  }

  function init(scope) {
    (scope || document).querySelectorAll('[data-rb-form]').forEach(mount);
  }

  window.RBForms = { __loaded: true, init: init, mount: mount, config: CONFIG, version: '1.2.0' };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
