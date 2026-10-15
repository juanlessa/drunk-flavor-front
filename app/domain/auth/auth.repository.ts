import type { $Fetch } from 'nitropack';
import type { Signup, Signin, ForgotPassword } from './auth.dtos';

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
		return $fetch('/forgot-password', {
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
