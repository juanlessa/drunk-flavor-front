import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import RatingStars from './RatingStars.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('RatingStars accessibility in the %s theme', (theme) => {
	it.each([0, 2.5, 5])('has no violations for value %s', async (value) => {
		await auditInBrowser(RatingStars, theme, {
			props: { value, label: `Rated ${value} out of 5` }
		});
	});
});
