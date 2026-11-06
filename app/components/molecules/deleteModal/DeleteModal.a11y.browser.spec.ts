import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import DeleteModal from './DeleteModal.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('DeleteModal accessibility in the %s theme', (theme) => {
	// The dialog renders in a portal outside the component root, so the whole document is audited.
	it('has no violations when open', async () => {
		await auditInBrowser(DeleteModal, theme, {
			props: {
				open: true,
				title: 'Delete drink',
				description: 'This action cannot be undone.'
			},
			root: 'body',
			expectPresent: '[role="alertdialog"]'
		});
	});
});
