import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('cPanel production packaging', () => {
  it('enables strict CMS validation before generating the release', async () => {
    const script = await readFile(resolve(process.cwd(), 'scripts/package-cpanel-release.sh'), 'utf8')

    expect(script).toContain('export NUXT_CMS_ENABLED=true')
    expect(script).toContain('export NUXT_CMS_STRICT=true')
    expect(script.indexOf('pnpm cms:validate')).toBeLessThan(script.indexOf('pnpm generate'))
    expect(script).toContain('if [[ -e "${archive_path}" ]]')
  })

  it('preserves WordPress directories before matching generated Nuxt routes', async () => {
    const rules = await readFile(resolve(process.cwd(), 'deploy/cpanel/live.htaccess'), 'utf8')

    expect(rules.indexOf('RewriteCond %{REQUEST_FILENAME} -d')).toBeLessThan(
      rules.indexOf('RewriteCond %{DOCUMENT_ROOT}/nuxt-app/current/$1/index.html -f'),
    )
  })
})
