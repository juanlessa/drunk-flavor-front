import { AUTH_TOKEN_NAME, SESSION_TOKEN_NAME } from '~/domain/auth/auth.constants';
import { authRepository } from '~/domain/auth/auth.repository';
import { categoriesRepository } from '~/domain/category/category.repository';
import { drinksRepository } from '~/domain/drink/drink.repository';
import { ingredientsRepository } from '~/domain/ingredient/ingredient.repository';
import { profileRepository } from '~/domain/profile/profile.repository';
import { usersRepository } from '~/domain/user/user.repository';

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

					options.headers = new Headers(options.headers);
					options.headers.set('Cookie', cookies);
				}
			}
		});

		const modules = {
			categories: categoriesRepository(apiFetcher),
			ingredients: ingredientsRepository(apiFetcher),
			drinks: drinksRepository(apiFetcher),
			users: usersRepository(apiFetcher),
			profile: profileRepository(apiFetcher),
			auth: authRepository(apiFetcher)
		};

		return {
			provide: {
				api: modules
			}
		};
	}
});
