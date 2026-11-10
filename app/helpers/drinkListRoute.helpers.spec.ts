import { describe, expect, it } from 'vitest';
import { DRINK_SEARCH_MAX_LENGTH } from '~/domain/drink/drink.constants';
import {
	buildDrinkListRouteQuery,
	isSameDrinkListRouteState,
	parseDrinkListRouteQuery
} from './drinkListRoute.helpers';

describe('parseDrinkListRouteQuery', () => {
	it('reads the search and the sort', () => {
		expect(parseDrinkListRouteQuery({ q: 'mar', sort: 'name' })).toEqual({
			term: 'mar',
			sort: 'name'
		});
	});

	it('falls back to no search and the rating sort', () => {
		expect(parseDrinkListRouteQuery({})).toEqual({ term: '', sort: 'rating' });
	});

	it('ignores a sort the list does not have', () => {
		expect(parseDrinkListRouteQuery({ sort: 'price' })).toEqual({ term: '', sort: 'rating' });
		expect(parseDrinkListRouteQuery({ sort: '' })).toEqual({ term: '', sort: 'rating' });
	});

	it('takes the first value of a repeated parameter', () => {
		expect(parseDrinkListRouteQuery({ q: ['gin', 'rum'], sort: ['recent', 'name'] })).toEqual({
			term: 'gin',
			sort: 'recent'
		});
	});

	it('cuts an oversized term at the longest one the API accepts', () => {
		const { term } = parseDrinkListRouteQuery({ q: 'a'.repeat(DRINK_SEARCH_MAX_LENGTH + 10) });

		expect(term).toHaveLength(DRINK_SEARCH_MAX_LENGTH);
	});

	it('treats an empty parameter as no value', () => {
		expect(parseDrinkListRouteQuery({ q: null, sort: null })).toEqual({
			term: '',
			sort: 'rating'
		});
	});
});

describe('buildDrinkListRouteQuery', () => {
	it('writes the search and a sort that is not the default', () => {
		expect(buildDrinkListRouteQuery({}, { term: 'mar', sort: 'name' })).toEqual({
			q: 'mar',
			sort: 'name'
		});
	});

	it('leaves out the defaults', () => {
		expect(
			buildDrinkListRouteQuery({ q: 'old', sort: 'name' }, { term: '', sort: 'rating' })
		).toEqual({});
	});

	it('trims the term', () => {
		expect(buildDrinkListRouteQuery({}, { term: '  gin ', sort: 'rating' })).toEqual({
			q: 'gin'
		});
	});

	it('keeps the other parameters of the URL', () => {
		expect(
			buildDrinkListRouteQuery({ utm: 'x', q: 'old' }, { term: 'new', sort: 'recent' })
		).toEqual({
			utm: 'x',
			q: 'new',
			sort: 'recent'
		});
	});
});

describe('isSameDrinkListRouteState', () => {
	it('compares the trimmed term and the sort', () => {
		expect(
			isSameDrinkListRouteState({ term: ' a ', sort: 'name' }, { term: 'a', sort: 'name' })
		).toBe(true);
		expect(
			isSameDrinkListRouteState({ term: 'a', sort: 'name' }, { term: 'b', sort: 'name' })
		).toBe(false);
		expect(
			isSameDrinkListRouteState({ term: 'a', sort: 'name' }, { term: 'a', sort: 'recent' })
		).toBe(false);
	});
});
