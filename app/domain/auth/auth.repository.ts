import type { $Fetch } from 'nitropack';
import type {
	Signup,
	Signin,
	ForgotPassword,
	ResetPassword,
	ConfirmEmail,
	ResendEmailVerification,
	GoogleAuth
} from './auth.dtos';
import type { SignoutResponse } from './auth.types';

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

	async forgotPassword(body: ForgotPassword) {
		return $fetch<undefined>('/password-reset/request', {
			method: 'POST',
			body
		});
	},

	async resetPassword(body: ResetPassword) {
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
			body
		});
	}
});
