import type { $Fetch } from 'nitropack';
import type {
	Signup,
	Signin,
	RequestPasswordReset,
	ConfirmPassword,
	ConfirmEmail,
	ResendEmailVerification,
	GoogleAuth,
	SignoutResponse
} from './auth.dtos';
import { GOOGLE_CODE_REQUEST_HEADERS } from '../shared/api.constants';

export const authRepository = ($fetch: $Fetch) => ({
	async signup(body: Signup) {
		return $fetch<undefined>('/signup', {
			method: 'POST',
			body
		});
	},

	async signin(body: Signin) {
		return $fetch<undefined>('/signin', {
			method: 'POST',
			body
		});
	},

	async signout() {
		return $fetch<SignoutResponse>('/signout', {
			method: 'POST'
		});
	},

	async requestPasswordReset(body: RequestPasswordReset) {
		return $fetch<undefined>('/password-reset/request', {
			method: 'POST',
			body
		});
	},

	async confirmPassword(body: ConfirmPassword) {
		return $fetch<undefined>('/password-reset/confirm', {
			method: 'POST',
			body
		});
	},

	async confirmEmail(body: ConfirmEmail) {
		return $fetch<undefined>('/email-verification/confirm', {
			method: 'POST',
			body
		});
	},

	async resendEmailVerification(body: ResendEmailVerification) {
		return $fetch<undefined>('/email-verification/resend', {
			method: 'POST',
			body
		});
	},

	async refreshToken() {
		return $fetch<undefined>('/refresh-token', {
			method: 'POST'
		});
	},
	async googleAuth(body: GoogleAuth) {
		return $fetch<undefined>('/google', {
			method: 'POST',
			headers: GOOGLE_CODE_REQUEST_HEADERS,
			body
		});
	}
});
