import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ManagementItemCard from './ManagementItemCard.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('ManagementItemCard accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([
		{},
		{ description: 'Spirit' },
		{ readonly: true },
		{ selectable: false }
	])('has no violations with extra props %o', async (extra) => {
		await auditInBrowser(ManagementItemCard, theme, { props: { title: 'Gin', ...extra } });
	});
});
