import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ManagementToolbar from './ManagementToolbar.vue';

afterAll(() => applyTheme('light'));

const props = {
	searchId: 'units-search',
	searchLabel: 'Search units',
	searchPlaceholder: 'Search units by name',
	createLabel: 'New unit'
};

describe.each(THEMES)('ManagementToolbar accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { searchTerm: 'gin' }])(
		'has no violations with extra props %o',
		async (extra) => {
			await auditInBrowser(ManagementToolbar, theme, { props: { ...props, ...extra } });
		}
	);
});
