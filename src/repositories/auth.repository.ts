import type { $Fetch } from 'nitropack';
import type { ILogin } from '~/types/authentication';

export const authRepository = ($fetch: $Fetch) => ({
	async login(body: ILogin) {
		return $fetch('/sessions', {
			method: 'POST',
			body
		});
	}
});
