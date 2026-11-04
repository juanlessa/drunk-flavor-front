/**
 * Sitemap source with one entry per public drink page.
 *
 * Walks the public drinks list of the API page by page. Each entry is a language-neutral path that
 * `_i18nTransform` expands into /en/drinks/<id> and /pt/drinks/<id>, with their hreflang alternates.
 * The sitemap module caches the resolved sitemap in production, so the API is not hit per request.
 */

/** Largest page the API accepts (MAX_QUERY_LIMIT in the backend). */
const PAGE_SIZE = 50;
/** Upper bound on pages walked, so an API that never returns a short page cannot loop forever. */
const MAX_PAGES = 200;
/** Name order keeps the pagination stable while drinks are being added. */
const SORT = JSON.stringify({ 'translations.en.name': 1 });

type DrinkSummary = { id: string; updatedAt?: string };

export default defineSitemapEventHandler(async () => {
	const { apiBase } = useRuntimeConfig().public;
	const entries = [];

	for (let page = 1; page <= MAX_PAGES; page++) {
		const drinks = await $fetch<DrinkSummary[]>('/drinks', {
			baseURL: apiBase,
			query: { page, limit: PAGE_SIZE, sort: SORT }
		});

		for (const drink of drinks) {
			entries.push({
				loc: `/drinks/${drink.id}`,
				lastmod: drink.updatedAt,
				_i18nTransform: true
			});
		}

		if (drinks.length < PAGE_SIZE) break;
	}

	return entries;
});
