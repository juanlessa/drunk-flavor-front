import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Text from './Text.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('Text accessibility in the %s theme', (theme) => {
	it.each(['p', 'span'] as const)('has no violations as %s', async (as) => {
		await auditInBrowser(Text, theme, { props: { as, value: 'Some text' } });
	});
});
