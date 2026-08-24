import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { contactPageContent } from '../app/data/contact'
import { homePageContent } from '../app/data/home'
import {
  aboutPageContent,
  blogPageContent,
  privacyPageContent,
  refundPageContent,
  ricePageContent,
  servicesPageContent,
  termsPageContent,
} from '../app/data/pages'
import { siteContent } from '../app/data/site'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(currentDirectory, '../wordpress/heekmah-content/content/seed.json')
const content = {
  site: siteContent,
  home: homePageContent,
  contact: contactPageContent,
  about: aboutPageContent,
  rice: ricePageContent,
  services: servicesPageContent,
  blog: blogPageContent,
  privacy: privacyPageContent,
  terms: termsPageContent,
  refunds: refundPageContent,
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8')

console.info(`Wrote WordPress content seed to ${outputPath}`)
