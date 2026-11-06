import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import InputNumber from './InputNumber.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('InputNumber accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([
		{},
		{ placeholder: '0' },
		{ integer: true },
		{ hasError: true },
		{ suffix: 'ml', suffixOutside: true }
	])('has no violations with props %o', async (props) => {
		await auditInBrowser(InputNumber, theme, { props, label: true });
	});
});
