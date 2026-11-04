import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Anchor from './Anchor.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('Anchor accessibility in the %s theme', (theme) => {
	it('has no violations with visible text', async () => {
		await auditInBrowser(Anchor, theme, { props: { to: '/', value: 'Home' } });
	});
});
