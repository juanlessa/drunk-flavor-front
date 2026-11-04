import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import RatingInput from './RatingInput.vue';

afterAll(() => applyTheme('light'));

const valueLabels = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];

describe.each(THEMES)('RatingInput accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { modelValue: 3 }, { disabled: true }])(
		'has no violations with props %o',
		async (props) => {
			await auditInBrowser(RatingInput, theme, {
				props: { name: 'rating', label: 'Rating', valueLabels, ...props }
			});
		}
	);
});
