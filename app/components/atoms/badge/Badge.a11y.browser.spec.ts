import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Badge from './Badge.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('Badge accessibility in the %s theme', (theme) => {
	it.each(['accent', 'success', 'warning', 'neutral'] as const)(
		'has no violations for the %s tone',
		async (tone) => {
			await auditInBrowser(Badge, theme, { props: { value: 'Label', tone } });
		}
	);
});
