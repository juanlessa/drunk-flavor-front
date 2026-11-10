import { describe, expect, it } from 'vitest';
import { buildManagementEntries, chunkManagementEntries } from './managementGroups.helpers';

const item = (id: string, createdBy?: string) => ({ id, createdBy });
const kinds = (entries: ReturnType<typeof buildManagementEntries<ReturnType<typeof item>>>) =>
	entries.map((entry) =>
		entry.kind === 'item' ? entry.item.id : entry.kind === 'header' ? entry.group : entry.kind
	);

describe('buildManagementEntries', () => {
	it('puts the own items first and the others after, each with a header', () => {
		const entries = buildManagementEntries(
			[item('a', 'me'), item('b', 'other'), item('c', 'me'), item('d')],
			'me',
			{ searching: false }
		);

		expect(kinds(entries)).toEqual(['own', 'a', 'c', 'others', 'b', 'd']);
	});

	it('shows the empty placeholder when the user owns nothing and no search is active', () => {
		const entries = buildManagementEntries([item('b', 'other')], 'me', { searching: false });

		expect(kinds(entries)).toEqual(['own', 'empty-own', 'others', 'b']);
	});

	it('hides the own group when a search finds none of the own items', () => {
		const entries = buildManagementEntries([item('b', 'other')], 'me', { searching: true });

		expect(kinds(entries)).toEqual(['others', 'b']);
	});

	it('hides the others group when there are none', () => {
		const entries = buildManagementEntries([item('a', 'me')], 'me', { searching: false });

		expect(kinds(entries)).toEqual(['own', 'a']);
	});

	it('returns nothing for an empty list', () => {
		expect(buildManagementEntries([], 'me', { searching: false })).toEqual([]);
	});

	it('returns a single list without headers when nobody is signed in', () => {
		const entries = buildManagementEntries([item('a', 'me'), item('b')], undefined, {
			searching: false
		});

		expect(kinds(entries)).toEqual(['a', 'b']);
	});

	it('keys every entry uniquely', () => {
		const entries = buildManagementEntries([item('a', 'me'), item('b', 'x')], 'me', {
			searching: false
		});

		expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
	});
});

describe('chunkManagementEntries', () => {
	const build = (items: ReturnType<typeof item>[], searching = false) =>
		buildManagementEntries(items, 'me', { searching });
	const shape = (rows: ReturnType<typeof chunkManagementEntries<ReturnType<typeof item>>>) =>
		rows.map((row) => row.map((entry) => (entry.kind === 'item' ? entry.item.id : entry.kind)));

	it('gives headers and the placeholder a row of their own', () => {
		const rows = chunkManagementEntries(build([item('b', 'other')]), 3);

		expect(shape(rows)).toEqual([['header'], ['empty-own'], ['header'], ['b']]);
	});

	it('does not mix the groups in one row', () => {
		const rows = chunkManagementEntries(
			build([item('a', 'me'), item('b', 'other'), item('c', 'other')]),
			2
		);

		expect(shape(rows)).toEqual([['header'], ['a'], ['header'], ['b', 'c']]);
	});

	it('wraps items by the column count', () => {
		const rows = chunkManagementEntries(
			build([item('a', 'me'), item('b', 'me'), item('c', 'me')]),
			2
		);

		expect(shape(rows)).toEqual([['header'], ['a', 'b'], ['c']]);
	});

	it('treats a column count below one as one', () => {
		const rows = chunkManagementEntries(build([item('a', 'me'), item('b', 'me')]), 0);

		expect(shape(rows)).toEqual([['header'], ['a'], ['b']]);
	});
});
