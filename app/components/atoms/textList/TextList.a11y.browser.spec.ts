import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import TextList from './TextList.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('TextList accessibility in the %s theme', (theme) => {
	it.each(['ul', 'ol'] as const)('has no violations as %s', async (as) => {
		await auditInBrowser(TextList, theme, {
			props: { as, marker: as === 'ol' ? 'decimal' : 'disc', items: ['One', 'Two', 'Three'] }
		});
	});
});
