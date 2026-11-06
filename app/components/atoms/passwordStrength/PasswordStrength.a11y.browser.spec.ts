import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import PasswordStrength from './PasswordStrength.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('PasswordStrength accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([
		{ active: true, password: '' },
		{ password: 'abc' },
		{ password: 'Abcdef1!', confirmPassword: 'Abcdef1!' },
		{ password: 'Abcdef1!', confirmPassword: 'different' }
	])('has no violations with props %o', async (props) => {
		await auditInBrowser(PasswordStrength, theme, { props });
	});
});
