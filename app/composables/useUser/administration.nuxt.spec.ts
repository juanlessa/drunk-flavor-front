import { describe, expect, it, vi } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { useUserAdministration } from './administration';

const user = {
	id: 'user-1',
	name: 'Bruno',
	surname: 'Costa',
	email: 'bruno.costa@example.com',
	emailVerified: true,
	role: 'partner',
	status: 'active'
};

registerEndpoint('/users/user-1', { method: 'GET', handler: () => user });
registerEndpoint('/users/user-1/administrative-capabilities', {
	method: 'GET',
	handler: () => ({ actions: ['suspend', 'changeRole'], roleTransitions: ['member'] })
});

describe('useUserAdministration', () => {
	it('loads the user with the capabilities granted for them', async () => {
		const administration = useUserAdministration('user-1');

		await vi.waitFor(() => expect(administration.user.value).toMatchObject(user));

		expect(administration.capabilities.value?.roleTransitions).toEqual(['member']);
		expect(administration.can('suspend')).toBe(true);
		expect(administration.can('close')).toBe(false);
	});
});
