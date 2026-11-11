import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ReadOnlyChoiceCards from './ReadOnlyChoiceCards.vue';

afterAll(() => applyTheme('light'));

const options = [
	{ value: 'generic', label: 'Any brand', description: 'Generic, like triple sec.' },
	{ value: 'branded', label: 'Specific brand', description: 'Needs one product.' }
];

// Contrast of the muted, unchosen card needs a real browser.
describe.each(THEMES)('ReadOnlyChoiceCards accessibility in the %s theme', (theme) => {
	it('has no violations', async () => {
		await auditInBrowser(ReadOnlyChoiceCards, theme, {
			props: { modelValue: 'branded', options, label: 'ingredient type' }
		});
	});
});
