import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ErrorMessage from './ErrorMessage.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('ErrorMessage accessibility in the %s theme', (theme) => {
	it('has no violations with a message', async () => {
		await auditInBrowser(ErrorMessage, theme, { props: { value: 'Required field' } });
	});
});
