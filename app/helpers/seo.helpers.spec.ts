import { describe, expect, it } from 'vitest';
import { formatIngredientList, getDrinkShareImage, toAbsoluteUrl } from './seo.helpers';

describe('formatIngredientList', () => {
	it('joins the names as an English list', () => {
		expect(formatIngredientList(['gin', 'Campari', 'sweet vermouth'], 'en')).toBe(
			'gin, Campari, and sweet vermouth'
		);
	});

	it('joins the names as a Portuguese list', () => {
		expect(formatIngredientList(['gin', 'Campari', 'vermute'], 'pt')).toBe(
			'gin, Campari e vermute'
		);
	});

	it('keeps only the first ingredients', () => {
		expect(formatIngredientList(['a', 'b', 'c', 'd', 'e'], 'en', 2)).toBe('a and b');
	});

	it('ignores blank names', () => {
		expect(formatIngredientList(['gin', ' ', 'tonic'], 'en')).toBe('gin and tonic');
	});

	it('returns an empty string when there are no ingredients', () => {
		expect(formatIngredientList([], 'en')).toBe('');
	});
});

const SITE_URL = 'https://drunkflavor.com';
const file = (url: string) => ({ name: 'file', mimetype: 'image/jpeg', url });

describe('toAbsoluteUrl', () => {
	it('keeps an absolute URL as it is', () => {
		expect(toAbsoluteUrl('https://cdn.drunkflavor.com/a.png', SITE_URL)).toBe(
			'https://cdn.drunkflavor.com/a.png'
		);
	});

	it('resolves a relative URL against the site', () => {
		expect(toAbsoluteUrl('/uploads/a.png', SITE_URL)).toBe(`${SITE_URL}/uploads/a.png`);
	});

	it('returns undefined for an empty or unusable URL', () => {
		expect(toAbsoluteUrl(undefined, SITE_URL)).toBeUndefined();
		expect(toAbsoluteUrl('', SITE_URL)).toBeUndefined();
		expect(toAbsoluteUrl('http://', SITE_URL)).toBeUndefined();
	});
});

describe('getDrinkShareImage', () => {
	it('shares the wide cover on the large card, described by the drink name', () => {
		expect(
			getDrinkShareImage(
				{
					cover: file('https://cdn.drunkflavor.com/cover.jpg'),
					thumbnail: file('https://cdn.drunkflavor.com/t.jpg')
				},
				'Negroni',
				SITE_URL
			)
		).toEqual({
			url: 'https://cdn.drunkflavor.com/cover.jpg',
			alt: 'Negroni',
			card: 'summary_large_image'
		});
	});

	it('falls back to the square thumbnail on the small card', () => {
		expect(
			getDrinkShareImage(
				{ thumbnail: file('https://cdn.drunkflavor.com/t.jpg') },
				'Negroni',
				SITE_URL
			)
		).toEqual({ url: 'https://cdn.drunkflavor.com/t.jpg', alt: 'Negroni', card: 'summary' });
	});

	it('returns undefined without pictures, so the site default image stays', () => {
		expect(getDrinkShareImage({}, 'Negroni', SITE_URL)).toBeUndefined();
	});

	it('makes a relative picture URL absolute', () => {
		expect(
			getDrinkShareImage({ cover: file('/uploads/c.jpg') }, 'Negroni', SITE_URL)?.url
		).toBe(`${SITE_URL}/uploads/c.jpg`);
	});
});
