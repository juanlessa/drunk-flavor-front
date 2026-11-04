import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser, clickElement } from '~/test/browserAxe';
import ActionMenu from './ActionMenu.vue';

afterAll(() => applyTheme('light'));

const items = [
	{ key: 'edit', label: 'Edit' },
	{ key: 'delete', label: 'Delete', tone: 'danger' as const }
];
const props = { label: 'More actions', items };

describe.each(THEMES)('ActionMenu accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { disabled: true }])(
		'has no violations when closed with extra props %o',
		async (extra) => {
			await auditInBrowser(ActionMenu, theme, { props: { ...props, ...extra } });
		}
	);

	// The menu renders in a portal and opens on pointerdown, so it is opened with a real click.
	it('has no violations when open', async () => {
		await auditInBrowser(ActionMenu, theme, {
			props,
			root: 'body',
			expectPresent: '[role="menuitem"]',
			prepare: () => clickElement('button[aria-label="More actions"]')
		});
	});
});
