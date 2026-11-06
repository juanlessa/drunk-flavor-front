import { h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import FormSection from './FormSection.vue';

afterAll(() => applyTheme('light'));

const slots = { default: () => h('p', { class: 'text-body text-content' }, 'Content') };

describe.each(THEMES)('FormSection accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { description: 'Update your details' }])(
		'has no violations with extra props %o',
		async (extra) => {
			await auditInBrowser(FormSection, theme, {
				props: { title: 'Profile', ...extra },
				slots
			});
		}
	);
});
