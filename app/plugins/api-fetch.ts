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

		// The auth cookies (Authorization, __Host-Refresh-Token) are HttpOnly
		// and owned by the backend, so client-side JS cannot read them. During
		// SSR we forward the browser's incoming Cookie header verbatim. We avoid
		// useCookie here because its forced initial client cookie write
		// re-serializes the __Host- prefixed cookie without the Secure
		// attribute, which cookie-es rejects on plain-HTTP dev.
		// useRequestHeaders must be read here in setup (inside the Nuxt
		// instance context), not inside the async onRequest callback.
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
