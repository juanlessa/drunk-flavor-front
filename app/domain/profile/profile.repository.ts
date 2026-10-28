import type { $Fetch } from 'nitropack';
import type { Profile } from '~/domain/profile/profile.entity';
import type {
	CreatePassword,
	LinkGoogleIdentity,
	ReauthenticateGoogle,
	UpdatePassword,
	UpdateProfile
} from '~/domain/profile/profile.dtos';

export const profileRepository = ($fetch: $Fetch) => ({
	async delete() {
		return $fetch<undefined>('/me', { method: 'DELETE' });
	},

	async get() {
		return $fetch<Profile>('/me');
	},

	async update(body: UpdateProfile) {
		return $fetch<undefined>('/me', { method: 'PATCH', body });
	},

	async createPassword(body: CreatePassword) {
		return $fetch<undefined>('/me/password', { method: 'POST', body });
	},

	async updatePassword(body: UpdatePassword) {
		return $fetch<undefined>('/me/password', { method: 'PATCH', body });
	},

	async linkGoogleIdentity(body: LinkGoogleIdentity) {
		return $fetch<undefined>('/me/identities/google', { method: 'POST', body });
	},

	async reauthenticateGoogle(body: ReauthenticateGoogle) {
		return $fetch<undefined>('/me/reauthentication/google', { method: 'POST', body });
	},

	async updateAvatar(file: File) {
		const formData = new FormData();
		formData.append('avatar', file);
		return $fetch<undefined>('/me/avatar', { method: 'PATCH', body: formData });
	}
});
