import { describe, expect, it } from 'vitest';
import { DRINK_SEARCH_MAX_LENGTH, DrinkListSorts, drinkListSorts } from './drink.constants';
import { buildDrinkListQuery } from './drink.query';

describe('buildDrinkListQuery', () => {
	it('sorts by rating score with the name as tie-breaker, in that order', () => {
		const { sort } = buildDrinkListQuery({
			term: '',
			sort: DrinkListSorts.rating,
			locale: 'pt'
		});

		expect(sort).toEqual({ ratingScore: 'desc', 'translations.pt.name': 'asc' });
		expect(Object.keys(sort ?? {})).toEqual(['ratingScore', 'translations.pt.name']);
	});

	it('sorts by the name in the language being read', () => {
		expect(
			buildDrinkListQuery({ term: '', sort: DrinkListSorts.name, locale: 'en' }).sort
		).toEqual({
			'translations.en.name': 'asc'
		});
		expect(
			buildDrinkListQuery({ term: '', sort: DrinkListSorts.name, locale: 'pt' }).sort
		).toEqual({
			'translations.pt.name': 'asc'
		});
	});

	it('sorts by creation date, newest first', () => {
		expect(
			buildDrinkListQuery({ term: '', sort: DrinkListSorts.recent, locale: 'pt' }).sort
		).toEqual({
			createdAt: 'desc'
		});
	});

	it.each(drinkListSorts)('does not search when the term is blank (%s)', (sort) => {
		expect(buildDrinkListQuery({ term: '   ', sort, locale: 'pt' }).search).toBeUndefined();
		expect(buildDrinkListQuery({ term: '', sort, locale: 'pt' }).search).toBeUndefined();
	});

	it('searches on the name of every language with the trimmed term', () => {
		expect(
			buildDrinkListQuery({ term: '  mar  ', sort: DrinkListSorts.rating, locale: 'pt' })
				.search
		).toEqual({
			name: 'mar'
		});
	});

	it('keeps the search whatever the sort', () => {
		for (const sort of drinkListSorts) {
			expect(buildDrinkListQuery({ term: 'gin', sort, locale: 'en' }).search).toEqual({
				name: 'gin'
			});
		}
	});

	it('cuts the term at the longest one the API accepts', () => {
		const { search } = buildDrinkListQuery({
			term: 'a'.repeat(DRINK_SEARCH_MAX_LENGTH + 20),
			sort: DrinkListSorts.rating,
			locale: 'pt'
		});

		expect(search?.name).toHaveLength(DRINK_SEARCH_MAX_LENGTH);
	});

	it('does not leave a trailing space when the cut falls after a space', () => {
		const term = `${'a'.repeat(DRINK_SEARCH_MAX_LENGTH - 1)} b`;

		expect(
			buildDrinkListQuery({ term, sort: DrinkListSorts.rating, locale: 'pt' }).search?.name
		).toBe('a'.repeat(DRINK_SEARCH_MAX_LENGTH - 1));
	});
});
