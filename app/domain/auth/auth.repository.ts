import type { $Fetch } from 'nitropack';
import type { Signup, Login, ForgotPassword } from './auth.dtos';

export const authRepository = ($fetch: $Fetch) => ({
	async signup(body: Signup) {
		return $fetch('/signup', {
			method: 'POST',
			body
		});
	},

	async login(body: Login) {
		return $fetch('/login', {
			method: 'POST',
			body
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
