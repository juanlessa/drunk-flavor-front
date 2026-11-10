import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import SortSelect from './SortSelect.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('SortSelect accessibility in the %s theme', (theme) => {
	it('has no violations', async () => {
		await auditInBrowser(SortSelect, theme, {
			props: {
				modelValue: 'rating',
				label: 'Sort by',
				id: 'sort',
				options: [
					{ label: 'Best rated', value: 'rating' },
					{ label: 'Name (A–Z)', value: 'name' }
				]
			}
		});
	});
});
