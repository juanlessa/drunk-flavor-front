import { describe, it, expect } from 'vitest';
import { serializeListQuery } from './query.helpers';

describe('serializeListQuery', () => {
	it('stringifies search and sort as JSON when defined', () => {
		const result = serializeListQuery({
			page: 1,
			limit: 10,
			search: { name: 'gin' },
			sort: { name: 'asc' }
		});

		expect(result.search).toBe(JSON.stringify({ name: 'gin' }));
		expect(result.sort).toBe(JSON.stringify({ name: 'asc' }));
	});

	it('omits search and sort keys when undefined', () => {
		const result = serializeListQuery({ page: 2, limit: 20 });

		expect('search' in result).toBe(false);
		expect('sort' in result).toBe(false);
	});

	it('keeps page and limit as numeric scalars', () => {
		const result = serializeListQuery({
			page: 3,
			limit: 50,
			search: { name: 'rum' }
		});

		expect(result.page).toBe(3);
		expect(result.limit).toBe(50);
		expect(typeof result.page).toBe('number');
		expect(typeof result.limit).toBe('number');
	});
});
