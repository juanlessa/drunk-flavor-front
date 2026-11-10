import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ReadOnlySwitch from './ReadOnlySwitch.vue';

afterAll(() => applyTheme('light'));

// Color contrast of the word on both pills needs a real browser.
describe.each(THEMES)('ReadOnlySwitch accessibility in the %s theme', (theme) => {
	it.each([true, false])('has no violations when checked is %s', async (checked) => {
		await auditInBrowser(ReadOnlySwitch, theme, { props: { checked } });
	});
});
