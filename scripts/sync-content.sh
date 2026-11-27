#!/usr/bin/env bash
# Pull admin-managed content (data/*.json + public/uploads/) from the live
# server so localhost matches production. Code still comes from git.
#
# Setup (once): add to .env.local (gitignored)
#   SYNC_REMOTE=root@your-server-ip:/home/<user>/htdocs/<domain>
#
# Usage:
#   pnpm sync:content            # pull content
#   pnpm sync:content --dry-run  # show what would change, copy nothing
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -z "${SYNC_REMOTE:-}" && -f .env.local ]]; then
  SYNC_REMOTE="$(grep -E '^SYNC_REMOTE=' .env.local | tail -1 | cut -d= -f2- | tr -d '"'"'"'')"
fi

if [[ -z "${SYNC_REMOTE:-}" ]]; then
  echo "SYNC_REMOTE is not set."
  echo "Add this line to .env.local:"
  echo "  SYNC_REMOTE=root@your-server-ip:/path/to/project"
  exit 1
fi

REMOTE="${SYNC_REMOTE%/}"
DRY=()
if [[ "${1:-}" == "--dry-run" || "${1:-}" == "-n" ]]; then
  DRY=(--dry-run)
  echo "Dry run — nothing will be copied."
fi

mkdir -p data public/uploads

# Back up local data before overwriting it
if [[ ${#DRY[@]} -eq 0 ]] && ls data/*.json >/dev/null 2>&1; then
  BACKUP="data/.backup-$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$BACKUP"
  cp data/*.json "$BACKUP"/
  echo "Local data backed up to $BACKUP"
fi

echo "→ Syncing data/*.json from $REMOTE"
rsync -avz "${DRY[@]}" --include='*.json' --exclude='*' "$REMOTE/data/" data/

echo "→ Syncing public/uploads/ from $REMOTE"
rsync -avz "${DRY[@]}" "$REMOTE/public/uploads/" public/uploads/

echo "Done. Refresh the browser — no rebuild needed."
