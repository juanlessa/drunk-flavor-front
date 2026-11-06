import { afterAll, describe, it, expect } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import GoogleIdentityButton from './GoogleIdentityButton.vue';

afterAll(() => applyTheme('light'));

// The button only renders when `public.googleClientId` is configured, and it then loads Google's script over the
// network. The test environment has neither, so this documents the hidden state instead of auditing contrast.
describe.each(THEMES)('GoogleIdentityButton accessibility in the %s theme', (theme) => {
	it('renders nothing without a configured client id', async () => {
		await auditInBrowser(GoogleIdentityButton, theme, { allowEmpty: true });

		expect(document.body.querySelector('button')).toBeNull();
	});
});
