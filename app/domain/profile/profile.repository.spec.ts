import { describe, expect, it, vi } from 'vitest';
import type { $Fetch } from 'nitropack';
import { profileRepository } from './profile.repository';

describe('profileRepository.unlinkGoogleIdentity', () => {
	it('deletes the Google identity of the account, without a body', async () => {
		const fetchMock = vi.fn().mockResolvedValue(undefined);

		await profileRepository(fetchMock as unknown as $Fetch).unlinkGoogleIdentity();

		expect(fetchMock).toHaveBeenCalledWith('/me/identities/google', { method: 'DELETE' });
	});
});
