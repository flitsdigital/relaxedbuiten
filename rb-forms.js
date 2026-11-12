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
          { name: 'woonplaats', label: 'Uw woonplaats', placeholder: 'Bijv. Ruinen', autocomplete: 'address-level2' },
          { name: 'akkoord', type: 'consent', required: true }
        ]
      ]
    },
    offerte: {
      title: 'Vrijblijvende offerte aanvragen',
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
          { name: 'bericht', label: 'Heeft u nog vragen of opmerkingen?', type: 'textarea', placeholder: 'Bijv. gewenste maat, levering of plaatsing' },
          { name: 'akkoord', type: 'consent', required: true }
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
          { name: 'bericht', label: 'Bericht', type: 'textarea', required: true, placeholder: 'Waar kunnen we u mee helpen?' },
          { name: 'akkoord', type: 'consent', required: true }
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

  /* ---------- Styles (in Shadow DOM, dus geen botsing met Webflow-CSS) ---------- */
  var CSS = [
    ':host{--rb-accent:#F99786;--rb-accent-dark:#e9785f;--rb-bg:#f2f2f2;--rb-text:#111;--rb-muted:#6b6b6b;--rb-line:#d9d9d9;--rb-error:#d64545;--rb-radius:28px;',
    '--rb-heading-font:Montserrat,system-ui,sans-serif;display:block;font-family:inherit;color:var(--rb-text)}',
    '*,*::before,*::after{box-sizing:border-box}',
    '.card{background:var(--rb-bg);border-radius:var(--rb-radius);padding:clamp(24px,4vw,48px);max-width:560px;margin:0 auto}',
    '.compact .card,.card.compact{max-width:none;padding:0;background:transparent}',
    '.progress{display:flex;gap:0;height:4px;background:#cecece;border-radius:4px;overflow:hidden;margin-bottom:12px}',
    '.progress span{display:block;height:100%;background:var(--rb-accent);transition:width .35s ease}',
    '.stepnr{font-size:15px;margin:0 0 28px}',
    'h2{font-family:var(--rb-heading-font);font-weight:700;font-size:clamp(26px,3.4vw,36px);line-height:1.2;text-align:center;margin:0 0 12px;letter-spacing:-.01em}',
    '.sub{text-align:center;color:var(--rb-muted);margin:0 0 24px;line-height:1.5}',
    '.cover{display:block;width:150px;margin:20px auto 36px;transform:perspective(600px) rotateX(18deg) rotateZ(-16deg);box-shadow:-10px 14px 22px rgba(0,0,0,.22);border-radius:3px}',
    '.row{display:grid;grid-template-columns:1fr 1fr;gap:16px}',
    '.wrap{container-type:inline-size}',
    '@container (max-width:420px){.row{grid-template-columns:1fr}}',
    '@media (max-width:480px){.row{grid-template-columns:1fr}}',
    '.field{margin:0 0 20px}',
    'label.l,.l{display:block;font-size:16px;margin:0 0 8px}',
    'legend.l{padding:0}',
    '.req{color:var(--rb-accent-dark)}',
    '.hint{font-size:13px;color:var(--rb-muted);margin:-4px 0 10px}',
    '.ctrl{position:relative}',
    '.ctrl svg{position:absolute;left:16px;top:50%;width:20px;height:20px;transform:translateY(-50%);fill:none;stroke:#111;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}',
    'input[type=text],input[type=email],input[type=tel],textarea{width:100%;font:inherit;font-size:16px;color:var(--rb-text);background:#fff;border:1px solid var(--rb-line);border-radius:999px;padding:12px 20px;min-height:46px;outline:none;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}',
    '.has-icon input{padding-left:48px}',
    'textarea{border-radius:22px;min-height:120px;resize:vertical;line-height:1.5}',
    'input::placeholder,textarea::placeholder{color:#9a9a9a}',
    'input:focus,textarea:focus{border-color:var(--rb-accent);box-shadow:0 0 0 3px rgba(249,151,134,.25)}',
    '.invalid input,.invalid textarea{border-color:var(--rb-error)}',
    '.err{color:var(--rb-error);font-size:13px;margin:6px 0 0 4px;min-height:0}',
    '.chips{display:flex;flex-wrap:wrap;gap:10px}',
    '.chip{position:relative}',
    '.chip input{position:absolute;opacity:0;inset:0;cursor:pointer}',
    '.chip span{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;border:1px solid var(--rb-line);background:#fff;font-size:15px;cursor:pointer;transition:all .15s}',
    '.chip span svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.4;display:none}',
    '.chip input:checked+span{background:var(--rb-accent);border-color:var(--rb-accent)}',
    '.chip input:checked+span svg{display:block}',
    '.chip input:focus-visible+span{box-shadow:0 0 0 3px rgba(249,151,134,.4)}',
    '.consent{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45;color:var(--rb-muted)}',
    '.consent input{width:18px;height:18px;margin:2px 0 0;accent-color:var(--rb-accent);flex:none}',
    '.consent a{color:inherit}',
    '.actions{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:28px}',
    '.actions.single{justify-content:flex-end}',
    'button{font:inherit;cursor:pointer;border:0}',
    '.btn{background:var(--rb-accent);color:#111;font-weight:700;font-size:16px;padding:14px 30px;border-radius:999px;white-space:nowrap;transition:background .15s,transform .1s;display:inline-flex;align-items:center;gap:10px}',
    '.btn:hover{background:var(--rb-accent-dark)}',
    '.btn:active{transform:translateY(1px)}',
    '.btn[disabled]{opacity:.6;cursor:wait}',
    '.btn .spin{width:16px;height:16px;border:2px solid rgba(0,0,0,.25);border-top-color:#111;border-radius:50%;animation:s .7s linear infinite}',
    '@keyframes s{to{transform:rotate(360deg)}}',
    '.back{background:none;color:var(--rb-text);display:inline-flex;align-items:center;gap:4px;font-size:15px;padding:8px 0}',
    '.back svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2}',
    '.formerr{background:#fff;border-left:4px solid var(--rb-error);padding:12px 16px;border-radius:8px;font-size:14px;margin-top:16px}',
    '.done{text-align:center;padding:12px 0}',
    '.done .tick{width:64px;height:64px;border-radius:50%;background:var(--rb-accent);display:grid;place-items:center;margin:0 auto 20px}',
    '.done .tick svg{width:30px;height:30px;fill:none;stroke:#111;stroke-width:2.6}',
    '.done p{color:var(--rb-muted);line-height:1.55;margin:0}',
    '.hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}',
    '.inline{display:flex;gap:10px;flex-wrap:wrap}',
    '.inline .field{flex:1 1 220px;margin:0}',
    '.inline .btn{flex:none}',
    '.compact h2{text-align:left;font-size:22px;margin-bottom:4px}',
    '.compact .sub{text-align:left;margin-bottom:16px}',
    '.compact .done{text-align:left}.compact .done .tick{margin:0 0 12px;width:44px;height:44px}',
    '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}'
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
    var req = f.required ? ' <span class="req" aria-hidden="true">*</span>' : '';
    if (f.type === 'consent') {
      return '<div class="field" data-f="' + f.name + '"><label class="consent"><input type="checkbox" name="' + f.name + '" required> <span>Ik ga akkoord met het <a href="' + esc(CONFIG.privacyUrl) + '" target="_blank" rel="noopener">privacybeleid</a> en wil per e-mail contact over mijn aanvraag.</span></label><p class="err" role="alert"></p></div>';
    }
    if (f.type === 'chips') {
      return '<fieldset class="field" data-f="' + f.name + '" style="border:0;padding:0;margin:0 0 20px"><legend class="l">' + esc(f.label) + req + '</legend>' +
        (f.hint ? '<p class="hint">' + esc(f.hint) + '</p>' : '') + '<div class="chips">' +
        f.options.map(function (o) { return '<label class="chip"><input type="checkbox" name="' + f.name + '" value="' + esc(o) + '"><span>' + ICONS.check + esc(o) + '</span></label>'; }).join('') +
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
    var title = ds.title || def.title;
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
    root.innerHTML = '<style>' + CSS + '</style><div class="wrap' + (def.compact ? ' compact' : '') + '"><div class="card"></div></div>';
    var card = root.querySelector('.card');

    var values = {};

    function render() {
      var multi = steps.length > 1;
      var html = '';
      if (multi) {
        html += '<div class="progress" aria-hidden="true"><span style="width:' + ((current + 1) / steps.length * 100) + '%"></span></div>' +
          '<p class="stepnr">Stap ' + (current + 1) + '/' + steps.length + '</p>';
      }
      html += '<h2>' + esc(title) + '</h2>';
      if (subtitle) html += '<p class="sub">' + esc(subtitle) + '</p>';
      if (showImage && current === 0) html += '<img class="cover" src="' + esc(image) + '" alt="Brochure RelaxedBuiten" width="150" height="194" loading="lazy">';
      html += '<form novalidate>';
      html += '<div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>';
      var isLast = current === steps.length - 1;
      if (def.compact) {
        html += '<div class="inline">' + steps[current].map(function (f) { return fieldHtml(f, id); }).join('') +
          '<button class="btn" type="submit">' + esc(submitLabel) + '</button></div>';
      } else {
        html += steps[current].map(function (f) { return fieldHtml(f, id); }).join('');
        html += '<div class="actions' + (current === 0 ? ' single' : '') + '">' +
          (current > 0 ? '<button type="button" class="back">' + ICONS.back + 'Terug</button>' : '') +
          '<button class="btn" type="submit">' + esc(isLast ? submitLabel : 'Volgende') + '</button></div>';
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
        } else if (f.type === 'consent') {
          if (els[0]) els[0].checked = !!values[f.name];
        } else if (els[0] && values[f.name]) {
          els[0].value = values[f.name];
        }
      });
    }

    function collect() {
      flatFields(steps[current]).forEach(function (f) {
        var els = card.querySelectorAll('[name="' + f.name + '"]');
        if (f.type === 'chips') values[f.name] = Array.prototype.filter.call(els, function (el) { return el.checked; }).map(function (el) { return el.value; });
        else if (f.type === 'consent') values[f.name] = els[0] && els[0].checked;
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
        else if (f.type === 'consent') { if (f.required && !v) msg = 'Vink dit aan om verder te gaan.'; }
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

      fetch(CONFIG.webhook, { method: 'POST', body: body, signal: ctrl ? ctrl.signal : undefined, mode: 'cors' })
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
      card.innerHTML = '<div class="done" role="status"><div class="tick">' + ICONS.check + '</div><h2>' + esc(def.success.title) + '</h2><p>' + esc(def.success.text) + '</p></div>';
    }

    render();
  }

  function init(scope) {
    (scope || document).querySelectorAll('[data-rb-form]').forEach(mount);
  }

  window.RBForms = { __loaded: true, init: init, mount: mount, config: CONFIG, version: '1.0.0' };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();
