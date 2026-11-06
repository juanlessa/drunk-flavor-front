import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Avatar from './Avatar.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('Avatar accessibility in the %s theme', (theme) => {
	it.each(['xs', 'sm', 'md', 'lg'] as const)(
		'has no violations for the %s size',
		async (size) => {
			await auditInBrowser(Avatar, theme, {
				props: { alt: 'User avatar', size, fallbackDelay: 0 }
			});
		}
	);
});
