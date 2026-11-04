import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import InputSwitch from './InputSwitch.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('InputSwitch accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { checked: true }, { disabled: true }])(
		'has no violations with props %o',
		async (props) => {
			await auditInBrowser(InputSwitch, theme, { props, label: true });
		}
	);
});
