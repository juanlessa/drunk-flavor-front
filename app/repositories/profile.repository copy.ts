import type { $Fetch } from 'nitropack';
import type { Profile } from '~/types/profile';

export const profileRepository = ($fetch: $Fetch) => ({
	async delete() {
		return $fetch('/me', {
			method: 'DELETE'
		});
	},

	async get() {
		return $fetch<Profile>('/me');
	}
});
