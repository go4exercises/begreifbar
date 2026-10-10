// leiste.js — mitlaufende Sprungleiste rechts neben dem Text, ab 1100 px Breite.
// Gemeinsam für werkstatt/, themen/ und kickoff/. Die Leiste wird aus der Seite gebaut:
//   h2                      → Abschnitt
//   .tag-kopf h3            → Untergruppe (Kurstage)
//   details mit Nummer      → Eintrag (.snr / .tnr / .anr); ein Klick öffnet ihn
// data-kurz="…" an h2 oder details setzt einen kürzeren Text für die Leiste.
// Schmaler als 1100 px bleibt die Seite unverändert. Kein Speicher, keine fremden Dateien.
(function () {
  'use strict';
  var main = document.querySelector('main');
  if (!main) return;

  var css = document.createElement('style');
  css.textContent = [
    '.leiste-rahmen { flex: 1; width: 100%; }',
    'main details, main h2, main h3 { scroll-margin-top: 18px; }',
    '.leiste { display: none; }',
    '@media (min-width: 1100px) {',
    '  .leiste-rahmen { display: grid; grid-template-columns: minmax(0, 74ch) 250px; gap: 0 48px; justify-content: center; }',
    '  .leiste-rahmen > main { margin: 0; max-width: none; }',
    '  .leiste { display: block; position: sticky; top: 0; align-self: start; max-height: 100vh; overflow-y: auto;',
    '    padding: 24px 4px 14px 0; font-size: 0.84rem; line-height: 1.35; }',
    '}',
    '.leiste-titel { font-family: var(--mono); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; color: var(--tinte-2); margin-bottom: 8px; }',
    '.leiste ol { list-style: none; padding: 0; margin: 0; border-left: 2px solid var(--linie); }',
    '.leiste a { display: block; padding: 3px 0 3px 12px; margin-left: -2px; border-left: 2px solid transparent;',
    '  color: var(--tinte-2); text-decoration: none; }',
    '.leiste a:hover { color: var(--tinte); }',
    '.leiste a.aktiv { color: var(--tinte); border-left-color: var(--tinte); font-weight: 700; }',
    '.leiste .l-h2 { margin-top: 8px; color: var(--tinte); font-weight: 700; }',
    '.leiste li:first-child .l-h2 { margin-top: 0; }',
    '.leiste .l-h3 { margin-top: 6px; font-size: 0.8rem; font-weight: 700; color: var(--tinte-2); }',
    '.leiste .l-nr { display: inline-block; min-width: 2.1em; font-family: var(--mono); font-size: 0.72rem; font-weight: 700; }',
    '@media print { .leiste { display: none !important; } }'
  ].join('\n');
  document.head.appendChild(css);

  // Ziele in Dokumentreihenfolge sammeln
  var ziele = [];
  var nrSel = '.snr, .tnr, .anr';
  main.querySelectorAll('h2, .tag-kopf h3, details').forEach(function (el, i) {
    if (el.tagName === 'DETAILS') {
      var nr = el.querySelector(':scope > summary ' + nrSel);
      if (!nr) return;
      var titel = el.querySelector(':scope > summary .stitel, :scope > summary .ttitel, :scope > summary .atitel');
      if (!el.id) el.id = (nr.closest('.anr') ? 'aufgabe-' : (nr.classList.contains('tnr') ? 'thema-' : '')) + nr.textContent.trim().toLowerCase();
      ziele.push({ el: el, art: 'eintrag', nr: nr.textContent.trim(), text: el.dataset.kurz || (titel ? titel.textContent.trim() : '') });
    } else if (el.tagName === 'H2') {
      var kopie = el.cloneNode(true);
      kopie.querySelectorAll('.ebene').forEach(function (e) { e.remove(); });
      if (!el.id) el.id = 'abschnitt-' + i;
      ziele.push({ el: el, art: 'h2', text: el.dataset.kurz || kopie.textContent.trim() });
    } else {
      if (!el.id) el.id = 'tag-' + i;
      ziele.push({ el: el, art: 'h3', text: el.textContent.trim() });
    }
  });
  if (ziele.length < 3) return;

  // Leiste bauen und neben main stellen
  var nav = document.createElement('nav');
  nav.className = 'leiste';
  nav.setAttribute('aria-label', 'Auf dieser Seite');
  var kopf = document.createElement('div');
  kopf.className = 'leiste-titel';
  kopf.textContent = 'AUF DIESER SEITE';
  nav.appendChild(kopf);
  var ol = document.createElement('ol');
  ziele.forEach(function (z) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + z.el.id;
    a.className = 'l-' + (z.art === 'eintrag' ? 'eintrag' : z.art);
    if (z.art === 'eintrag') {
      var n = document.createElement('span');
      n.className = 'l-nr';
      n.textContent = z.nr;
      a.appendChild(n);
      a.appendChild(document.createTextNode(z.text));
    } else {
      a.textContent = z.text;
    }
    a.addEventListener('click', function (e) {
      if (z.el.tagName === 'DETAILS') z.el.open = true;
      e.preventDefault();
      z.el.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', '#' + z.el.id);
    });
    z.link = a;
    li.appendChild(a);
    ol.appendChild(li);
  });
  nav.appendChild(ol);

  var rahmen = document.createElement('div');
  rahmen.className = 'leiste-rahmen';
  main.parentNode.insertBefore(rahmen, main);
  rahmen.appendChild(main);
  rahmen.appendChild(nav);

  // Aufgerufen mit #a3 o. ä.: den Eintrag öffnen
  var start = location.hash && document.getElementById(location.hash.slice(1));
  if (start && start.tagName === 'DETAILS') { start.open = true; start.scrollIntoView({ block: 'start' }); }

  // Aktuellen Abschnitt hervorheben: das letzte Ziel, dessen Oberkante schon oben ist
  var aktiv = null, wartet = false;
  function markieren() {
    wartet = false;
    var neu = ziele[0];
    for (var i = 0; i < ziele.length; i++) {
      if (ziele[i].el.getBoundingClientRect().top < 120) neu = ziele[i]; else break;
    }
    if (neu === aktiv) return;
    if (aktiv) aktiv.link.classList.remove('aktiv');
    neu.link.classList.add('aktiv');
    aktiv = neu;
    var r = neu.link.getBoundingClientRect(), n = nav.getBoundingClientRect();
    if (r.top < n.top || r.bottom > n.bottom) neu.link.scrollIntoView({ block: 'nearest' });
  }
  window.addEventListener('scroll', function () { if (!wartet) { wartet = true; requestAnimationFrame(markieren); } }, { passive: true });
  window.addEventListener('resize', markieren);
  markieren();
})();
