import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import SearchSortToolbar from './SearchSortToolbar.vue';

afterAll(() => applyTheme('light'));

const props = {
	searchId: 'drinks-search',
	searchLabel: 'Search drinks',
	searchPlaceholder: 'Search drinks by name',
	sortId: 'drinks-sort',
	sortLabel: 'Sort by',
	sortOptions: [
		{ label: 'Best rated', value: 'rating' },
		{ label: 'Name (A–Z)', value: 'name' },
		{ label: 'Newest', value: 'recent' }
	]
};

describe.each(THEMES)('SearchSortToolbar accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{ sort: 'rating' }, { sort: 'name', searchTerm: 'gin' }])(
		'has no violations with extra props %o',
		async (extra) => {
			await auditInBrowser(SearchSortToolbar, theme, {
				props: { ...props, sort: 'rating', ...extra }
			});
		}
	);
});
