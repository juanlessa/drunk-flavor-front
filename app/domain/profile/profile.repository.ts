import type { $Fetch } from 'nitropack';
import type { Profile } from '~/domain/profile/profile.entity';
import type { UpdatePassword, UpdateProfile } from '~/domain/profile/profile.dtos';

export const profileRepository = ($fetch: $Fetch) => ({
	async delete() {
		return $fetch<undefined>('/me', {
			method: 'DELETE'
		});
	},

	async get() {
		return $fetch<Profile>('/me');
	},

	async update(body: UpdateProfile) {
		return $fetch<undefined>('/me', {
			method: 'PATCH',
			body
		});
	},

	async updatePassword(body: UpdatePassword) {
		return $fetch<undefined>('/update-password', {
			method: 'PATCH',
			body
		});
	}
});
