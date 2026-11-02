import type { $Fetch } from 'nitropack';
import type {
	CreatePassword,
	LinkGoogleIdentity,
	ReauthenticateGoogle,
	ReauthenticatePassword,
	UpdatePassword,
	UpdateProfile
} from './profile.dtos';
import type { Profile } from './profile.entity';
import { GOOGLE_CODE_REQUEST_HEADERS } from '../shared/api.constants';

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
		return $fetch<undefined>('/me/identities/google', {
			method: 'POST',
			headers: GOOGLE_CODE_REQUEST_HEADERS,
			body
		});
	},
	async reauthenticateGoogle(body: ReauthenticateGoogle) {
		return $fetch<undefined>('/me/reauthentication/google', {
			method: 'POST',
			headers: GOOGLE_CODE_REQUEST_HEADERS,
			body
		});
	},
	async reauthenticatePassword(body: ReauthenticatePassword) {
		return $fetch<undefined>('/me/reauthentication/password', { method: 'POST', body });
	},
	async updateAvatar(file: File) {
		const body = new FormData();
		body.append('avatar', file);
		return $fetch<undefined>('/me/avatar', { method: 'PATCH', body });
	}
});
