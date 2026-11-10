import { describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import { useAuthoredRecord } from './useAuthoredRecord';

const mockCan = vi.hoisted(() => vi.fn());
mockNuxtImport('useAppAbility', () => () => ({ can: mockCan }));

registerEndpoint('/categories/me/abc', {
	method: 'GET',
	handler: () => ({ id: 'abc', createdBy: 'someone-else' })
});

describe('useAuthoredRecord', () => {
	it('starts without a record or a permission answer', () => {
		const { record, canUpdate } = useAuthoredRecord({
			key: 'test-authored-start',
			subject: 'Category',
			fetch: () => new Promise<{ createdBy?: string }>(() => undefined)
		});

		expect(record.value).toBeUndefined();
		expect(canUpdate.value).toBeUndefined();
	});

	it('loads the record through the given read and answers the permission', async () => {
		mockCan.mockReturnValue(false);
		const { $api } = useNuxtApp();
		const { record, canUpdate } = useAuthoredRecord({
			key: 'test-authored-load',
			subject: 'Category',
			fetch: () => $api.categories.getWithAuthorship('abc')
		});

		await vi.waitFor(() => expect(record.value).toBeDefined());
		await flushPromises();

		expect(record.value?.id).toBe('abc');
		expect(canUpdate.value).toBe(false);
		expect(mockCan).toHaveBeenCalledWith('update', {
			__typename: 'Category',
			createdBy: 'someone-else'
		});
	});
});
