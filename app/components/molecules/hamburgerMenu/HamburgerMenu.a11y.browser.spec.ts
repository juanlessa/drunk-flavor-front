import { h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import HamburgerMenu from './HamburgerMenu.vue';

afterAll(() => applyTheme('light'));

const props = { title: 'Navigation', openLabel: 'Open menu', closeLabel: 'Close menu' };
const slots = {
	default: () =>
		h('nav', { 'aria-label': 'Main' }, [
			h('a', { href: '/', class: 'text-body text-content' }, 'Home')
		])
};

describe.each(THEMES)('HamburgerMenu accessibility in the %s theme', (theme) => {
	it('has no violations when closed', async () => {
		await auditInBrowser(HamburgerMenu, theme, { props });
	});

	// The panel renders in a portal outside the component root, so the whole document is audited.
	it('has no violations when open', async () => {
		await auditInBrowser(HamburgerMenu, theme, {
			props: { ...props, open: true },
			slots,
			root: 'body',
			expectPresent: '[role="dialog"]'
		});
	});
});
