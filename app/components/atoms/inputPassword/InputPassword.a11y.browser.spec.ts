import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import InputPassword from './InputPassword.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('InputPassword accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { placeholder: 'Password' }, { hasError: true }])(
		'has no violations with props %o',
		async (props) => {
			await auditInBrowser(InputPassword, theme, { props, label: true });
		}
	);
});
