# CLAUDE.md — Startseite begreifbar.ch

Dieses Repo ist die Startseite `begreifbar.ch` und zugleich ihre Auslieferung über GitHub
Pages (README.md). Daneben liegen die Repos der Lehrmittel: `../tals-mathe`,
`../tals-physik`, `../sek1-mathe`.

## Andere Repos: lesen ja, schreiben nie

- Aus einer Sitzung in diesem Repo wird **ausschliesslich hier** geschrieben. In jedem
  anderen Repo gilt: kein Edit, kein neues oder gelöschtes File, kein `git`-Befehl, der
  etwas ändert, kein Skriptlauf, der dort etwas schreibt — auch nicht über einen Subagenten
  oder einen parallelen Agenten, und auch dann nicht, wenn der Auftrag beide Repos nennt.
- Lesen ist erlaubt: zählen, vergleichen, Farben, Adressen und Texte für diese Seite holen.
- **Warum:** Eine Sitzung lädt `CLAUDE.md` und `.claude/settings.json` nur ihres eigenen
  Verzeichnisses. Von hier aus geschrieben, gälten drüben weder deren Konventionen noch deren
  Berechtigungen, und in den Lehrmittel-Repos laufen oft eigene Sitzungen, deren Arbeit
  ein fremder Commit vermischt. Am 10.10.2026 ist genau das passiert: Aus dieser Sitzung
  wurden beide Lehrmittel-Repos umgebaut und committet, obwohl ein Auftrag für die
  dortigen Sitzungen gemeint war.
- **Arbeit für ein anderes Repo** wird als Auftrag geschrieben, den der Auftraggeber in
  einer Sitzung *dort* aufruft: eine Datei `/home/paps/TODO-<thema>.md` (ausserhalb aller
  Repos) oder Text im Chat — nachgezählt, mit Dateien, Stellen und Reihenfolge, so dass die
  dortige Sitzung ihn ohne Rückfrage abarbeiten kann.
- **«Schreib mir ein HOWTO / einen Auftrag für Repo X»** heisst: die Anleitung schreiben,
  nicht die Arbeit ausführen. Im Zweifel fragen.
