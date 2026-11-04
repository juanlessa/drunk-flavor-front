import { describe, expect, it } from 'vitest';
import { formatIngredientList } from './seo.helpers';

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
