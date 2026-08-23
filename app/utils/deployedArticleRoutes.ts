import type { ArticleSummary } from '~/types/content'

interface ArticleRouteManifest {
  readonly routes: readonly string[]
}

let manifestRequest: Promise<ReadonlySet<string>> | undefined

function parseArticleRouteManifest(value: unknown): ReadonlySet<string> {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('routes' in value) ||
    !Array.isArray(value.routes) ||
    !value.routes.every((route) => typeof route === 'string' && /^\/[a-z0-9-]+\/$/.test(route))
  ) {
    throw new TypeError('The deployed article route manifest is malformed.')
  }

  return new Set(value.routes)
}

export function filterDeployedArticleSummaries(
  summaries: readonly ArticleSummary[],
  deployedRoutes: ReadonlySet<string>,
): readonly ArticleSummary[] {
  return summaries.filter((article) => deployedRoutes.has(article.to))
}

export async function getDeployedArticleRoutes(): Promise<ReadonlySet<string>> {
  manifestRequest ??= $fetch<unknown>('/_heekmah/article-routes.json', {
    timeout: 8_000,
    retry: 1,
  }).then(parseArticleRouteManifest)

  return await manifestRequest
}
