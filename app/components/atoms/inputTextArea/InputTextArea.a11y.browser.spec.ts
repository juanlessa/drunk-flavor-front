import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import InputTextArea from './InputTextArea.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('InputTextArea accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([
		{},
		{ placeholder: 'Describe it' },
		{ hasError: true },
		{ border: true }
	])('has no violations with props %o', async (props) => {
		await auditInBrowser(InputTextArea, theme, { props, label: true });
	});
});
