import { describe, expect, it } from 'vitest';
import type { LocationQuery } from 'vue-router';
import {
	buildFavoriteRedirect,
	readFavoriteIntent,
	withoutFavoriteIntent
} from './favorite.helpers';
describe('buildFavoriteRedirect', () => {
	it('keeps the page and adds the drink to save', () => {
		expect(buildFavoriteRedirect('/drinks/abc', 'drink-1')).toBe(
			'/drinks/abc?favorite=drink-1'
		);
	});
	it('keeps the search, the order and the hash of the page', () => {
		expect(buildFavoriteRedirect('/pt?q=gin&sort=name#top', 'drink-1')).toBe(
			'/pt?q=gin&sort=name&favorite=drink-1#top'
		);
	});
	it('replaces a drink that was already asked for', () => {
		expect(buildFavoriteRedirect('/?favorite=old', 'new')).toBe('/?favorite=new');
	});
});
describe('readFavoriteIntent', () => {
	it('reads a drink id', () => {
		expect(readFavoriteIntent({ favorite: '66b0000000000000000000a1' })).toBe(
			'66b0000000000000000000a1'
		);
	});
	it.each([undefined, '', ['a', 'b'], 'not an id', 'a/b', 'x'.repeat(65)])(
		'ignores %j',
		(value) => {
			expect(readFavoriteIntent({ favorite: value } as LocationQuery)).toBeUndefined();
		}
	);
});
describe('withoutFavoriteIntent', () => {
	it('drops the drink and keeps the rest', () => {
		expect(withoutFavoriteIntent({ favorite: 'a', q: 'gin' })).toEqual({ q: 'gin' });
	});
});
