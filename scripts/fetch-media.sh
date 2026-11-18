#!/usr/bin/env bash
# Downloads featured images referenced by migrated fixtures into public/media/ (resized, 1200px max).
# Prototype convenience only: production media should come from the approved CMS / DAM.
#
# WHAT: reads every `image` URL from the two WordPress snapshots
#   (src/data/migrated/articles.wp-snapshot.json and case-studies.wp-snapshot.json), downloads each
#   one, and writes a resized JPEG to public/media/{base name}.jpg.
# WHY: src/lib/media.ts (localMedia) serves these local copies instead of hot-linking WordPress; it
#   falls back to the live URL when a file is missing.
#
# USAGE: ./scripts/fetch-media.sh   (no arguments; can be run from any directory)
# REQUIRES: bash, node (to read the JSON), curl, ImageMagick `convert`, outbound HTTPS.
# SIDE EFFECTS: creates files in public/media/ (the folder must exist); uses /tmp/qw-media.bin as a
#   scratch download file.
#
# GOTCHAS
#   - Idempotent: a non-empty existing file is skipped, so delete a file to force a re-download.
#   - The output name rule (last URL segment, query removed, extension replaced by .jpg) must stay
#     identical to localMedia() in src/lib/media.ts, or the site will not find the files.
#   - A failed download or conversion does not stop the loop (it is inside an && chain); that file
#     simply gets no "ok" line.
#   - URLs are split on whitespace, so a URL containing a space would break.
set -euo pipefail
# Work from the project root so the relative paths below resolve.
cd "$(dirname "$0")/.."
# Collect every non-empty image URL from both snapshots, one per line.
urls=$(node -e '
const a=require("./src/data/migrated/articles.wp-snapshot.json");const c=require("./src/data/migrated/case-studies.wp-snapshot.json");
console.log([...a.map(x=>x.image),...c.map(x=>x.image)].filter(Boolean).join("\n"))')
for u in $urls; do
  # Target file: base name without query string or extension, always saved as .jpg.
  f="public/media/$(basename "${u%%\?*}" | sed 's/\.[a-zA-Z]*$//').jpg"
  # Skip images already mirrored (file exists and is not empty).
  [ -s "$f" ] && continue
  # Download (follow redirects, 60 s limit), then convert: first frame only ([0]), shrink to fit
  # 1200x1200 only if larger ('>'), strip metadata, JPEG quality 78, flatten transparency onto white.
  curl -sSL --max-time 60 "$u" -o /tmp/qw-media.bin && convert /tmp/qw-media.bin[0] -resize '1200x1200>' -strip -quality 78 -background white -flatten "$f" && echo "ok $f"
done
