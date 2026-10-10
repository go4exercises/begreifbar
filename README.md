# Startseite `begreifbar.ch`

Dieses Repo ist die **einzige Quelle** der Startseite und zugleich ihre
Auslieferung über GitHub Pages: `main` / Wurzel, `CNAME` = `begreifbar.ch`,
Enforce HTTPS an. Ein eigenes Repo, weil GitHub Pages eine Domain an genau ein
Repo bindet und `mathe.begreifbar.ch` bzw. `physik.begreifbar.ch` an *TALS-Mathe*
und *TALS-Physik* hängen. Die Seite hat keine Abhängigkeiten in die Fach-Repos
und keine Drittanbieter.

## Inhalt

| Datei | Zweck |
|---|---|
| `index.html` | die Startseite, CSS inline |
| `schriften.css` + `schriften/` | die drei Schriften, lokal ausgeliefert — eigene Kopie, weil dieses Repo nicht auf die Wurzel des Mathe-Repos zugreifen kann |
| `CNAME` | `begreifbar.ch` — eine Zeile, LF, kein BOM |
| `favicon.svg` | Platzhalter-Zeichen: zwei Balken in Mathe-Blau und Physik-Bernstein |
| `projektwoche/` | Projektwoche IDM 2027: Ausschreibung mit Eckdaten und Wegweiser |
| `projektwoche/beispiele/` | drei Beispielprodukte (Lernkartei, Rechner, Spiel), aus `Beispielseite-Projektwoche-2027` übernommen; nur Rücklink und Handy-Raster im Spiel angepasst |
| `projektwoche/themen/` | die zwölf Kursthemen der Ausschreibung, nach Tagen geordnet und gewichtet |
| `projektwoche/werkstatt/` | Entstehung von begreifbar und Einsteiger-Anleitung (Weg A Claude-App, Weg B Ubuntu + Claude Code), mit `einrichten.sh` und `CLAUDE-vorlage.md` |
| `projektwoche/kickoff/` | Entwurf für den Kick-off im Januar 2027 — **bewusst nirgends verlinkt** und `noindex`, bis Daten, Altersfrage und Abo geklärt sind; Platzhalter ⟪…⟫ |
| `.nojekyll` | schaltet die Jekyll-Verarbeitung ab, wie im Mathe-Repo |

## Ändern

Direkt hier im Repo bearbeiten, committen, pushen — Pages baut aus `main` /
Wurzel, nach ein bis zwei Minuten ist die Änderung live. Es gibt keine zweite
Kopie mehr; der frühere Ordner `apex-startseite/` im Mathe-Repo ist seit
08.10.2026 entfernt.

**Danach prüfen:** `curl -s https://begreifbar.ch/ | grep -c googleapis` muss `0`
ergeben, und im Netzwerk-Tab darf keine Anfrage an einen fremden Host stehen.

## Aufsetzen (erledigt, zur Dokumentation)

1. Repository anlegen, z. B. `go4exercises/begreifbar`, öffentlich.
2. `index.html`, `schriften.css`, `schriften/`, `CNAME`, `favicon.svg` und
   `.nojekyll` ins Wurzelverzeichnis legen — nicht in einen Unterordner, sonst
   liefert Pages 404.
3. Pushen.
4. **Settings → Pages**: Source auf `Deploy from a branch`, Branch `main`, Ordner `/ (root)`.
   Unter *Custom domain* sollte `begreifbar.ch` bereits aus der `CNAME`-Datei stehen.
5. Warten, bis GitHub das Zertifikat ausgestellt hat (bis zu 24 h), dann
   **Enforce HTTPS** anhaken.

Die DNS-Einträge stehen schon (Phase 1): vier A- und vier AAAA-Records am Apex,
`www` als CNAME. Es fehlt ausschliesslich das Repo, das die Domain beansprucht.

~~**Solange das nicht gemacht ist, zeigen `begreifbar.ch` und `www.begreifbar.ch`
eine Zertifikatswarnung** — die Namen lösen bereits auf GitHub Pages auf, aber
kein Repo beansprucht sie, also liefert GitHub das Platzhalter-Zertifikat
`CN=*.github.io` aus und dahinter eine 404.~~

**Erledigt.** Gemessen am 31.8.2026: Zertifikat gültig, Enforce HTTPS aktiv, keine
Warnung mehr.

### `www` mitnehmen

Ein Pages-Repo bedient entweder `begreifbar.ch` **oder** `www.begreifbar.ch`.
Trägt man den Apex als Custom domain ein, leitet GitHub `www` automatisch
dorthin um, sofern der CNAME-Eintrag steht — das ist hier der Fall. Nach dem
Aufsetzen einmal `curl -I https://www.begreifbar.ch/` prüfen.

## Was bewusst nicht drin ist

- **Kein `og:image`.** Ein Vorschaubild müsste diese Seite zeigen, nicht eines
  der beiden Fächer; `og-bild.png` aus dem Mathe-Repo trägt «Mathe begreifbar»
  und wäre hier falsch. Link-Vorschauen zeigen vorerst nur Titel und Text. Wenn
  du eines willst: `.claude/tools/build-bilder.mjs` im Mathe-Repo ist die
  Vorlage, dort ist der Aufbau in ~40 Zeilen HTML beschrieben.
- **Kein eigenes Impressum.** Fusszeile und Rechtliches verweisen auf
  `mathe.begreifbar.ch`, damit der Text nur an einer Stelle gepflegt wird und
  nicht auseinanderläuft. Wenn der Apex später eigenständig wirken soll, gehört
  eine eigene `rechtliches.html` dazu.
- **Das Favicon ist ein Platzhalter** — zwei Balken in den Fachfarben, kein
  gestaltetes Zeichen. Es funktioniert bei 16 px und passt ins Farbsystem, mehr
  nicht.

## Ein Fach dazunehmen

`scripts/neue-subdomain.py` im Mathe-Repo macht den ganzen Weg von der ZIP-Datei
bis zur fertigen Kachel:

```bash
python3 scripts/neue-subdomain.py chemie ~/Downloads/chemie.zip \
    --titel Chemie --marke Grundlagenfach --farbe gruen \
    --text "Stoffe, Reaktionen und Stöchiometrie — mit Rechenweg."
```

Es packt das ZIP aus, legt `CNAME` und `.nojekyll` an, wartet auf den
DNS-Eintrag, erstellt das Repository, schaltet Pages ein, erzwingt HTTPS, klont
dieses Repo, hängt die Kachel ein und pusht. Mit `--nur-pruefen` läuft alles bis
zum Auspacken, ohne etwas anzulegen.

Eine **einzelne Seite** geht genauso — dann ohne Kachel, weil sie nicht ins
Fächer-Verzeichnis gehört:

```bash
python3 scripts/neue-subdomain.py sonnenfinsternis ~/sonnenfinsternis.html --ohne-kachel
```

Die Datei wird zu `index.html`; verweist sie auf Bilder oder CSS daneben, meldet
das Skript die Fundstellen — dann entweder alles einbetten oder ein ZIP übergeben.

Die Kacheln stehen zwischen `<!-- FAECHER:ANFANG -->` und `<!-- FAECHER:ENDE -->`,
die Fachfarben zwischen `<!-- FACHFARBEN:ANFANG -->` und `<!-- FACHFARBEN:ENDE -->` —
das Skript schreibt genau dorthin. Von Hand geht es genauso: eine Kachel kopieren,
Klasse `f-<fach>` vergeben und eine Farbzeile ergänzen.

**Sek1-Mathe ist die Ausnahme:** Die Kachel steht bewusst *ausserhalb* der
`FAECHER`-Marken als schmale, ruhige Spalte links (`.reihe` → `.fach-klein`). Sie
ist ein einziger Link ohne Wahl zwischen Themenseite und Leitprogramm, weil das
Angebot kleiner ist und die BM-Fächer im Vordergrund stehen sollen.

Das Raster ist auf `repeat(auto-fit, minmax(340px, 1fr))` gestellt und trägt zwei
Fächer so gut wie fünf. **Was nicht mitwächst, ist die Prosa:** Überschrift,
Seitentitel, Beschreibung, Kopfzeile, Zielgruppe und Fuss nennen die Fächer und
Stufen namentlich (seit Sek1-Mathe: «Sekundarstufe I und Berufsmaturität», keine
Anzahl mehr). Kommt ein Fach oder eine Stufe dazu, gehört das nachgezogen — das
Skript listet beim Einfügen die betroffenen Zeilen auf.

## Pflege

Die Seite nennt die Fächer, aber keine Kapitel — sie muss also nicht
mitwachsen, wenn in Mathe oder Physik Teilgebiete dazukommen. Zu ändern ist sie
nur, wenn ein Fach dazukommt, eine Adresse wechselt oder die Fachbeschreibung
nicht mehr stimmt.
