import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ManagementGroupRow from './ManagementGroupRow.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('ManagementGroupRow accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([
		{ variant: 'header', group: 'own' },
		{ variant: 'header', group: 'others' },
		{ variant: 'empty-own', createLabel: 'New unit' }
	])('has no violations with props %o', async (props) => {
		await auditInBrowser(ManagementGroupRow, theme, { props });
	});
});
