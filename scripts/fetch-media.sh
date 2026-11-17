#!/usr/bin/env bash
# Downloads featured images referenced by migrated fixtures into public/media/ (resized, 1200px max).
# Prototype convenience only: production media should come from the approved CMS / DAM.
set -euo pipefail
cd "$(dirname "$0")/.."
urls=$(node -e '
const a=require("./src/data/migrated/articles.wp-snapshot.json");const c=require("./src/data/migrated/case-studies.wp-snapshot.json");
console.log([...a.map(x=>x.image),...c.map(x=>x.image)].filter(Boolean).join("\n"))')
for u in $urls; do
  f="public/media/$(basename "${u%%\?*}" | sed 's/\.[a-zA-Z]*$//').jpg"
  [ -s "$f" ] && continue
  curl -sSL --max-time 60 "$u" -o /tmp/qw-media.bin && convert /tmp/qw-media.bin[0] -resize '1200x1200>' -strip -quality 78 -background white -flatten "$f" && echo "ok $f"
done
