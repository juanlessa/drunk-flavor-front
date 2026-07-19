import type { $Fetch } from 'nitropack';
import type { Profile } from '~/domain/profile/profile.entity';

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
