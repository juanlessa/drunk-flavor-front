import { h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import HoverCard from './HoverCard.vue';

afterAll(() => applyTheme('light'));

const slots = {
	trigger: () => h('button', { type: 'button', class: 'text-body text-content' }, 'Details'),
	default: () => h('p', { class: 'p-3 text-body text-content' }, 'More information')
};

describe.each(THEMES)('HoverCard accessibility in the %s theme', (theme) => {
	it('has no violations when closed', async () => {
		await auditInBrowser(HoverCard, theme, { slots });
	});

	// The card renders in a portal outside the component root, so the whole document is audited.
	it('has no violations when open', async () => {
		await auditInBrowser(HoverCard, theme, {
			props: { open: true },
			slots,
			root: 'body',
			expectPresent: 'p.p-3'
		});
	});
});
