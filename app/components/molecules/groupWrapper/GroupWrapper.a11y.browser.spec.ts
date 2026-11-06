import { h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import GroupWrapper from './GroupWrapper.vue';

afterAll(() => applyTheme('light'));

const slots = { default: () => h('p', { class: 'text-body text-content' }, 'Content') };

describe.each(THEMES)('GroupWrapper accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { title: 'Group title' }])(
		'has no violations with props %o',
		async (props) => {
			await auditInBrowser(GroupWrapper, theme, { props, slots });
		}
	);
});
