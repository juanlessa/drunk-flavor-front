import type { $Fetch } from 'nitropack';
import type {
	Signup,
	Signin,
	ForgotPassword,
	ResetPassword,
	ConfirmEmail,
	ResendEmailVerification
} from './auth.dtos';

export const authRepository = ($fetch: $Fetch) => ({
	async signup(body: Signup) {
		return $fetch('/signup', {
			method: 'POST',
			body
		});
	},

	async signin(body: Signin) {
		return $fetch('/signin', {
			method: 'POST',
			body
		});
	},

	async signout() {
		return $fetch('/signout', {
			method: 'POST'
		});
	},

	async forgotPassword(body: ForgotPassword) {
		return $fetch('/password-reset/request', {
			method: 'POST',
			body
		});
	},

	async resetPassword(body: ResetPassword) {
		return $fetch('/password-reset/confirm', {
			method: 'POST',
			body
		});
	},

	async confirmEmail(body: ConfirmEmail) {
		return $fetch('/email-verification/confirm', {
			method: 'POST',
			body
		});
	},

	async resendEmailVerification(body: ResendEmailVerification) {
		return $fetch('/email-verification/resend', {
			method: 'POST',
			body
		});
	},

	async refreshToken() {
		return $fetch('/refresh-token', {
			method: 'POST'
		});
	}
});
