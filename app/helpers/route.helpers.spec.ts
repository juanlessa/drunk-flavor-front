import { describe, expect, it } from 'vitest';
import { getLocaleAgnosticPageKey } from './route.helpers';

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
