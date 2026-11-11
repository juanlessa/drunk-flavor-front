import { describe, expect, it } from 'vitest';
import { getBaseRouteName, getLocaleAgnosticPageKey, shouldScrollToTop } from './route.helpers';

describe('getLocaleAgnosticPageKey', () => {
	it('gives the same key to the same page in every language', () => {
		const english = getLocaleAgnosticPageKey({ name: 'index___en', path: '/', params: {} });
		const portuguese = getLocaleAgnosticPageKey({
			name: 'index___pt',
			path: '/pt',
			params: {}
		});

		expect(english).toBe(portuguese);
	});

	it('tells different pages apart', () => {
		expect(getLocaleAgnosticPageKey({ name: 'index___en', path: '/', params: {} })).not.toBe(
			getLocaleAgnosticPageKey({ name: 'terms___en', path: '/terms', params: {} })
		);
	});

	it('tells the same page with different params apart', () => {
		expect(
			getLocaleAgnosticPageKey({
				name: 'drinks-id___en',
				path: '/drinks/a',
				params: { id: 'a' }
			})
		).not.toBe(
			getLocaleAgnosticPageKey({
				name: 'drinks-id___pt',
				path: '/pt/drinks/b',
				params: { id: 'b' }
			})
		);
	});

	it('falls back to the path when the route has no name', () => {
		expect(getLocaleAgnosticPageKey({ path: '/somewhere', params: {} })).toBe('/somewhere:{}');
	});
});

describe('shouldScrollToTop', () => {
	it('scrolls to the top when going to another page', () => {
		expect(
			shouldScrollToTop(
				{ name: 'terms___en', path: '/en/terms', params: {} },
				{ name: 'index___en', path: '/en', params: {} }
			)
		).toBe(true);
	});

	it('scrolls to the top when going to the same page with other params', () => {
		expect(
			shouldScrollToTop(
				{ name: 'drinks-id___en', path: '/en/drinks/b', params: { id: 'b' } },
				{ name: 'drinks-id___en', path: '/en/drinks/a', params: { id: 'a' } }
			)
		).toBe(true);
	});

	it('keeps the position when only the language changes', () => {
		expect(
			shouldScrollToTop(
				{ name: 'bar___pt', path: '/pt/bar', params: {} },
				{ name: 'bar___en', path: '/en/bar', params: {} }
			)
		).toBe(false);
	});
});

describe('getBaseRouteName', () => {
	it.each([
		['bar___pt', 'bar'],
		['drinks-id___en', 'drinks-id'],
		['index', 'index']
	])('reads %s as %s', (name, expected) => {
		expect(getBaseRouteName(name)).toBe(expected);
	});
	it('has no name for a route without one', () => {
		expect(getBaseRouteName(undefined)).toBeUndefined();
		expect(getBaseRouteName(Symbol('route'))).toBeUndefined();
	});
});
