import { AUTH_TOKEN_NAME, SESSION_TOKEN_NAME } from '~/constants/authentication';
import { authRepository } from '~/repositories/auth.repository';
import { categoriesRepository } from '~/repositories/categories.repository';
import { usersRepository } from '~/repositories/users.repository';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	const apiFetcher = $fetch.create({
		baseURL: config.public.apiBase,
		credentials: 'include',
		onRequest: async ({ options }) => {
			if (import.meta.server) {
				const token = useCookie(AUTH_TOKEN_NAME).value || '';
				const session = useCookie(SESSION_TOKEN_NAME).value || '';

				const cookies = [
					`${AUTH_TOKEN_NAME}=${token}`,
					`${SESSION_TOKEN_NAME}=${session}`
				].join('; ');

				options.headers = { ...options.headers, Cookie: cookies };
			}
		}
	});

	const modules = {
		categories: categoriesRepository(apiFetcher),
		users: usersRepository(apiFetcher),
		auth: authRepository(apiFetcher)
	};

	return {
		provide: {
			api: modules
		}
	};
});
