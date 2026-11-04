import { h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Form from './Form.vue';

afterAll(() => applyTheme('light'));

const slots = {
	default: () => [
		h('label', { for: 'email' }, 'Email'),
		h('input', { id: 'email', type: 'email' })
	]
};

describe.each(THEMES)('Form accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { title: 'Sign in' }])(
		'has no violations with props %o',
		async (props) => {
			await auditInBrowser(Form, theme, { props, slots });
		}
	);
});
