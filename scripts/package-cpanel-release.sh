#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
release_id="${1:-$(date -u +%Y%m%dT%H%M%SZ)}"
artifact_dir="${project_root}/artifacts/cpanel"
archive_path="${artifact_dir}/heekmah-nuxt-${release_id}.zip"

cd "${project_root}"

pnpm content:export
pnpm test
pnpm exec nuxi typecheck
pnpm generate
pnpm audit:seo
mkdir -p "${artifact_dir}"

(
  cd .output/public
  zip -qr "${archive_path}" .
)

cp deploy/cpanel/live.htaccess "${artifact_dir}/live.htaccess"
cp deploy/cpanel/staging.htaccess "${artifact_dir}/staging.htaccess"

printf '%s\n' "Created ${archive_path}"
