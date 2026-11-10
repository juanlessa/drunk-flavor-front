import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useManagementGroups } from './useManagementGroups';

const mockCan = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({ $auth: { state: ref({ user: { id: 'me' } }) } }));
vi.stubGlobal('useAppAbility', () => ({ can: mockCan }));

type Item = { id: string; createdBy?: string };
const items: Item[] = [
	{ id: 'a', createdBy: 'other' },
	{ id: 'b', createdBy: 'me' }
];

describe('useManagementGroups', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('groups the entries by the signed-in user', () => {
		const { entries } = useManagementGroups({
			items: () => items,
			subject: 'Unit',
			searching: () => false
		});

		expect(entries.value.map((entry) => entry.key)).toEqual([
			'header-own',
			'b',
			'header-others',
			'a'
		]);
	});

	it('follows the search state', () => {
		const searching = ref(false);
		const { entries } = useManagementGroups({
			items: () => [items[0]!],
			subject: 'Unit',
			searching
		});

		expect(entries.value.map((entry) => entry.kind)).toContain('empty-own');

		searching.value = true;

		expect(entries.value.map((entry) => entry.kind)).not.toContain('empty-own');
	});

	it('asks the ability about the record, with its subject and creator', () => {
		mockCan.mockReturnValue(false);
		const { canChange } = useManagementGroups({
			items: () => items,
			subject: 'Drink',
			searching: () => false
		});

		expect(canChange('update', items[0]!)).toBe(false);
		expect(mockCan).toHaveBeenCalledWith('update', { __typename: 'Drink', createdBy: 'other' });
	});
});
