import type { $Fetch } from 'nitropack';
import type { Profile } from '~/domain/profile/profile.entity';
import type { ConfirmEmail, ResetPassword, UpdatePassword, UpdateProfile } from '~/domain/profile/profile.dtos';

export const profileRepository = ($fetch: $Fetch) => ({
	async delete() {
		return $fetch('/me', {
			method: 'DELETE'
		});
	},

	async get() {
		return $fetch<Profile>('/me');
	},

	async update(body: UpdateProfile) {
		return $fetch('/me', {
			method: 'PATCH',
			body
		});
	},

	async confirmEmail(body: ConfirmEmail) {
		return $fetch('/confirm-email', {
			method: 'POST',
			body
		});
	},

	async resetPassword(body: ResetPassword) {
		return $fetch('/reset-password', {
			method: 'POST',
			body
		});
	},

	async updatePassword(body: UpdatePassword) {
		return $fetch('/update-password', {
			method: 'PATCH',
			body
		});
	}
});
