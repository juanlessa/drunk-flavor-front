import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Heading from './Heading.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('Heading accessibility in the %s theme', (theme) => {
	it.each(['titleSm', 'title', 'titleLg', 'headlineSm', 'headline', 'headlineLg'] as const)(
		'has no violations for the %s size',
		async (size) => {
			await auditInBrowser(Heading, theme, { props: { as: 'h2', value: 'Title', size } });
		}
	);
});
