import { describe, it, expect } from 'vitest';
import { chunkArray } from './array';

describe('chunkArray', () => {
	it('splits an array into chunks of the specified size', () => {
		const result = chunkArray([1, 2, 3, 4, 5, 6], 2);

		expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
	});

	it('handles arrays not evenly divisible by chunk size', () => {
		const result = chunkArray([1, 2, 3, 4, 5], 3);

		expect(result).toEqual([[1, 2, 3], [4, 5]]);
	});

	it('returns one chunk when chunk size equals array length', () => {
		const result = chunkArray([1, 2, 3], 3);

		expect(result).toEqual([[1, 2, 3]]);
	});

	it('returns individual items when chunk size is 1', () => {
		const result = chunkArray([1, 2, 3], 1);

		expect(result).toEqual([[1], [2], [3]]);
	});

	it('returns empty array when input is empty', () => {
		const result = chunkArray([], 3);

		expect(result).toEqual([]);
	});

	it('works with string arrays', () => {
		const result = chunkArray(['a', 'b', 'c', 'd'], 2);

		expect(result).toEqual([['a', 'b'], ['c', 'd']]);
	});

	it('works with object arrays', () => {
		const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
		const result = chunkArray(items, 2);

		expect(result).toEqual([[{ id: 1 }, { id: 2 }], [{ id: 3 }]]);
	});

	it('throws error when chunk size is 0', () => {
		expect(() => chunkArray([1, 2, 3], 0)).toThrow('Chunk size must be greater than 0');
	});

	it('throws error when chunk size is negative', () => {
		expect(() => chunkArray([1, 2, 3], -1)).toThrow('Chunk size must be greater than 0');
	});
});
