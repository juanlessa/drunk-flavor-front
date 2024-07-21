import { AUTH_TOKEN_NAME, SESSION_TOKEN_NAME } from '~/constants/authentication';
import { authRepository } from '~/repositories/auth.repository';
import { categoriesRepository } from '~/repositories/categories.repository';
import { drinksRepository } from '~/repositories/drinks.repository';
import { ingredientsRepository } from '~/repositories/ingredients.repository';
import { usersRepository } from '~/repositories/users.repository';

export default defineNuxtPlugin({
	name: 'api-fetch',
	parallel: true,
	setup() {
		const config = useRuntimeConfig();
		const tokenCookie = useCookie(AUTH_TOKEN_NAME);
		const sessionCookie = useCookie(SESSION_TOKEN_NAME);

		const apiFetcher = $fetch.create({
			baseURL: config.public.apiBase,
			credentials: 'include',
			onRequest: async ({ options }) => {
				if (import.meta.server) {
					const token = tokenCookie.value || '';
					const session = sessionCookie.value || '';

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
			drinks: drinksRepository(apiFetcher),
			ingredients: ingredientsRepository(apiFetcher),
			users: usersRepository(apiFetcher),
			auth: authRepository(apiFetcher)
		};

		return {
			provide: {
				api: modules
			}
		};
	}
});
