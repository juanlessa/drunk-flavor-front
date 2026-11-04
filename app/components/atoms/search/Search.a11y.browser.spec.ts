import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser, typeInto } from '~/test/browserAxe';
import Search from './Search.vue';

afterAll(() => applyTheme('light'));

const options = [
	{ label: 'Whiskey', value: 'whiskey', description: 'Spirit' },
	{ label: 'Rum', value: 'rum' }
];
const props = { options, placeholder: 'Search', noResult: 'No results' };

describe.each(THEMES)('Search accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { hasError: true }])(
		'has no violations when closed with extra props %o',
		async (extra) => {
			await auditInBrowser(Search, theme, { props: { ...props, ...extra }, label: true });
		}
	);

	it('has no violations when open with results', async () => {
		await auditInBrowser(Search, theme, {
			props,
			label: true,
			root: 'body',
			expectPresent: '[role="option"]',
			prepare: () => typeInto('input[role="combobox"]', 'r')
		});
	});

	it('has no violations when open without results', async () => {
		await auditInBrowser(Search, theme, {
			props,
			label: true,
			root: 'body',
			expectPresent: '[role="listbox"]',
			prepare: () => typeInto('input[role="combobox"]', 'zzz')
		});
	});
});
