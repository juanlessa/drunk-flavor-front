import { authRepository } from '~/domain/auth/auth.repository';
import { categoriesRepository } from '~/domain/category/category.repository';
import { commentsRepository } from '~/domain/comment/comment.repository';
import { drinksRepository } from '~/domain/drink/drink.repository';
import { ingredientsRepository } from '~/domain/ingredient/ingredient.repository';
import { profileRepository } from '~/domain/profile/profile.repository';
import { ratingsRepository } from '~/domain/rating/rating.repository';
import { unitsRepository } from '~/domain/unit/unit.repository';
import { usersRepository } from '~/domain/user/user.repository';
import { COMPLETE_PROFILE_PATH, PROFILE_INCOMPLETE_LOCALE_KEY } from '~/helpers/profile.helpers';

export default defineNuxtPlugin({
	name: 'api-fetch',
	parallel: true,
	setup(nuxtApp) {
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
			},
			onResponseError: ({ response }) => {
				// Safety net for the route guards: a business route rejected the request because
				// the account still has to add its name (e.g. the profile changed in another tab).
				if (
					import.meta.client &&
					response._data?.localeKey === PROFILE_INCOMPLETE_LOCALE_KEY
				) {
					// i18n uses the `no_prefix` strategy, so the path is locale-independent.
					void nuxtApp.runWithContext(() => navigateTo(COMPLETE_PROFILE_PATH));
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
