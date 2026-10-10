#!/usr/bin/env bash
# einrichten.sh — die Werkzeuge der begreifbar-Werkstatt auf Ubuntu
# (auch Ubuntu unter Windows, «WSL»). Quelle: https://begreifbar.ch/projektwoche/werkstatt/
#
# Aufruf im Ubuntu-Terminal:   bash einrichten.sh
#
# Installiert: git, python3, node/npm, gh (GitHub CLI), curl, unzip und Claude Code.
# Richtet Git mit deinem Namen ein und meldet dich bei GitHub an.
# Das Skript darf mehrmals laufen: Was schon da ist, wird übersprungen.
set -euo pipefail

echo
echo "  begreifbar-Werkstatt einrichten"
echo "  Installiert git, python3, node/npm, gh, curl, unzip und Claude Code."
echo "  Für apt fragt Ubuntu nach deinem Passwort (beim Tippen sieht man nichts)."
echo
read -rp "  Weiter? [j/N] " antwort
[[ "${antwort:-}" == [jJ] ]] || { echo "  Abgebrochen."; exit 0; }

echo; echo "── 1/4  Programme aus Ubuntu ──────────────────────────────"
sudo apt update
sudo apt install -y git python3 nodejs npm gh curl unzip

echo; echo "── 2/4  Claude Code ───────────────────────────────────────"
if command -v claude >/dev/null 2>&1 || [ -x "$HOME/.local/bin/claude" ]; then
  echo "  Claude Code ist schon installiert."
else
  curl -fsSL https://claude.ai/install.sh | bash
fi

echo; echo "── 3/4  Git: wer bist du? ─────────────────────────────────"
if [ -z "$(git config --global user.name || true)" ]; then
  read -rp "  Dein Name (erscheint bei jedem Commit): " name
  git config --global user.name "$name"
fi
if [ -z "$(git config --global user.email || true)" ]; then
  read -rp "  Deine E-Mail (dieselbe wie bei GitHub): " mail
  git config --global user.email "$mail"
fi
git config --global init.defaultBranch main
echo "  Git kennt dich als: $(git config --global user.name) <$(git config --global user.email)>"

echo; echo "── 4/4  Bei GitHub anmelden ───────────────────────────────"
if gh auth status >/dev/null 2>&1; then
  echo "  Schon angemeldet."
else
  echo "  Wähle: GitHub.com → HTTPS → Login with a web browser."
  gh auth login
fi

echo; echo "── Fertig ─────────────────────────────────────────────────"
git --version
python3 --version
echo "node $(node --version)"
gh --version | head -1
if command -v claude >/dev/null 2>&1; then
  echo "claude $(claude --version)"
else
  echo "  Claude Code ist installiert, aber dieses Terminal kennt es noch nicht."
  echo "  Terminal schliessen, neu öffnen und «claude --version» tippen."
fi
echo
echo "  Weiter geht es mit Schritt B4 «Das erste Projekt» auf der Werkstatt-Seite."
