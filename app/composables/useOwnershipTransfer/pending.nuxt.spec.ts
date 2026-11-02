import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import type { Profile } from '~/domain/profile/profile.entity';
import { usePendingOwnershipTransfer } from './pending';

const PATH = '/administration/ownership-transfer';
const calls = { get: 0, resend: 0, cancel: 0 };
let pending: Record<string, unknown> | null = null;
let failing = false;

registerEndpoint(PATH, {
	method: 'GET',
	handler: () => {
		calls.get += 1;
		if (failing) throw new Error('get failed');
		return pending;
	}
});
registerEndpoint(`${PATH}/resend`, {
	method: 'POST',
	handler: () => {
		calls.resend += 1;
		pending = { ...pending, expiresAt: '2099-01-02T00:00:00.000Z' };
		return null;
	}
});
registerEndpoint(PATH, {
	method: 'DELETE',
	handler: () => {
		calls.cancel += 1;
		pending = null;
		return null;
	}
});

const signInAs = (role: Profile['role']) => {
	useNuxtApp().$auth.state.value = {
		isAuthenticated: true,
		user: { id: 'owner-1', role, status: 'active' } as Profile
	};
};

describe('usePendingOwnershipTransfer', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		calls.get = 0;
		calls.resend = 0;
		calls.cancel = 0;
		failing = false;
		pending = {
			targetUserId: 'admin-1',
			reason: 'Handing over the project',
			expiresAt: '2099-01-01T00:00:00.000Z'
		};
	});

	it('loads the invitation for the owner and identifies its invitee', async () => {
		signInAs('owner');
		const transfer = usePendingOwnershipTransfer();

		await transfer.load();

		expect(calls.get).toBe(1);
		expect(transfer.invitation.value?.targetUserId).toBe('admin-1');
		expect(transfer.isInvitee('admin-1')).toBe(true);
		expect(transfer.isInvitee('admin-2')).toBe(false);
		expect(transfer.isExpired.value).toBe(false);
	});

	it('never calls the owner-only endpoint for other roles', async () => {
		signInAs('admin');
		const transfer = usePendingOwnershipTransfer();

		await transfer.load();

		expect(calls.get).toBe(0);
		expect(transfer.invitation.value).toBeNull();
		expect(transfer.isLoaded.value).toBe(true);
	});

	it('treats an empty response as no invitation', async () => {
		signInAs('owner');
		pending = null;
		const transfer = usePendingOwnershipTransfer();

		await transfer.load();

		expect(transfer.invitation.value).toBeNull();
	});

	it('flags a failed load', async () => {
		signInAs('owner');
		failing = true;
		const transfer = usePendingOwnershipTransfer();

		await transfer.load();

		expect(transfer.hasError.value).toBe(true);
	});

	it('reloads after resending and clears the invitation after cancelling', async () => {
		signInAs('owner');
		const transfer = usePendingOwnershipTransfer();
		await transfer.load();

		await transfer.resend();
		expect(calls.resend).toBe(1);
		expect(transfer.invitation.value?.expiresAt).toBe('2099-01-02T00:00:00.000Z');

		await transfer.cancel();
		expect(calls.cancel).toBe(1);
		expect(transfer.invitation.value).toBeNull();
	});

	it('shares one state between callers', async () => {
		signInAs('owner');
		await usePendingOwnershipTransfer().load();

		expect(usePendingOwnershipTransfer().isInvitee('admin-1')).toBe(true);
	});
});
