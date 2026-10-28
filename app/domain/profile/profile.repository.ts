import type { $Fetch } from 'nitropack';
import { mapProfileResponse, type ProfileResponse } from './profile.api';
import type {
	CreatePassword,
	LinkGoogleIdentity,
	ReauthenticateGoogle,
	UpdatePassword,
	UpdateProfile
} from './profile.dtos';

export const profileRepository = ($fetch: $Fetch) => ({
	async delete() {
		return $fetch<undefined>('/me', { method: 'DELETE' });
	},
	async get() {
		return mapProfileResponse(await $fetch<ProfileResponse>('/me'));
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
		const body = new FormData();
		body.append('avatar', file);
		return $fetch<undefined>('/me/avatar', { method: 'PATCH', body });
	}
});
