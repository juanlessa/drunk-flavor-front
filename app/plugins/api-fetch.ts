import { authRepository } from '~/domain/auth/auth.repository';
import { categoriesRepository } from '~/domain/category/category.repository';
import { commentsRepository } from '~/domain/comment/comment.repository';
import { drinksRepository } from '~/domain/drink/drink.repository';
import { ingredientsRepository } from '~/domain/ingredient/ingredient.repository';
import { profileRepository } from '~/domain/profile/profile.repository';
import { ratingsRepository } from '~/domain/rating/rating.repository';
import { unitsRepository } from '~/domain/unit/unit.repository';
import { usersRepository } from '~/domain/user/user.repository';

export default defineNuxtPlugin({
	name: 'api-fetch',
	parallel: true,
	setup() {
		const config = useRuntimeConfig();

		const incomingCookie = import.meta.server
			? useRequestHeaders(['cookie']).cookie
			: undefined;

		const apiFetcher = $fetch.create({
			baseURL: config.public.apiBase,
			credentials: 'include',
			onRequest: async ({ options }) => {
				if (import.meta.server && incomingCookie) {
					options.headers = new Headers(options.headers);
					options.headers.set('Cookie', incomingCookie);
				}
			}
		});

		const modules = {
			categories: categoriesRepository(apiFetcher),
			units: unitsRepository(apiFetcher),
			ingredients: ingredientsRepository(apiFetcher),
			drinks: drinksRepository(apiFetcher),
			comments: commentsRepository(apiFetcher),
			ratings: ratingsRepository(apiFetcher),
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
