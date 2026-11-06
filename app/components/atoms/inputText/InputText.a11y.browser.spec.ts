import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import InputText from './InputText.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('InputText accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([
		{},
		{ placeholder: 'Type here' },
		{ disabled: true, placeholder: 'Type here' },
		{ hasError: true },
		{ suffix: 'ml' }
	])('has no violations with props %o', async (props) => {
		await auditInBrowser(InputText, theme, { props, label: true });
	});
});
