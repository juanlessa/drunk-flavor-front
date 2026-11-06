import { defineComponent, h } from 'vue';
import { afterAll, describe, it, expect } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';

afterAll(() => applyTheme('light'));

// Negative controls: prove the browser audit can actually fail, so a green suite is meaningful.
// Components must be defined with defineComponent: the Nuxt renderer ignores plain functional components.
const LowContrastText = defineComponent({
	render: () => h('p', { style: 'color: #777777; background-color: #888888;' }, 'Hard to read')
});
const GoodContrastText = defineComponent({
	render: () => h('p', { style: 'color: #000000; background-color: #ffffff;' }, 'Easy to read')
});

describe.each(THEMES)('browser axe audit in the %s theme', (theme) => {
	it('reports insufficient color contrast', async () => {
		await expect(auditInBrowser(LowContrastText, theme)).rejects.toThrow('color-contrast');
	});

	it('passes sufficient color contrast', async () => {
		await auditInBrowser(GoodContrastText, theme);
	});

	it('fails when an expected open-state element is missing', async () => {
		await expect(
			auditInBrowser(GoodContrastText, theme, { expectPresent: '[role="dialog"]' })
		).rejects.toThrow();
	});
});
