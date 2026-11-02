import type { NuxtApp } from '#app';
import { authRepository } from '~/domain/auth/auth.repository';
import { categoriesRepository } from '~/domain/category/category.repository';
import { commentsRepository } from '~/domain/comment/comment.repository';
import { drinksRepository } from '~/domain/drink/drink.repository';
import { ingredientsRepository } from '~/domain/ingredient/ingredient.repository';
import { ownershipTransferRepository } from '~/domain/ownershipTransfer/ownershipTransfer.repository';
import { profileRepository } from '~/domain/profile/profile.repository';
import { ratingsRepository } from '~/domain/rating/rating.repository';
import { unitsRepository } from '~/domain/unit/unit.repository';
import { usersRepository } from '~/domain/user/user.repository';
import { ApiErrorCodes } from '~/domain/shared/api.constants';
import { hasApiErrorCode } from '~/domain/shared/api.helpers';
import { COMPLETE_PROFILE_PATH } from '~/helpers/profile.helpers';

const ACCEPT_LANGUAGE_HEADER = 'Accept-Language';
const SIGNIN_PATH = '/signin';

/**
 * Locale the API should answer in: the i18n locale active when the request is sent, so error messages
 * follow the language the user is currently seeing. `undefined` when i18n is not installed (Histoire builds).
 */
export const readRequestLocale = (i18n: unknown): string | undefined => {
	const locale = (i18n as { locale?: { value?: unknown } } | undefined)?.locale?.value;
	return typeof locale === 'string' && locale ? locale : undefined;
};

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
				// ofetch has already merged the request headers into a `Headers` instance; mutate it in place.
				const { headers } = options;
				if (import.meta.server && incomingCookie) headers.set('Cookie', incomingCookie);

				// Read on every request, not at setup, so a language switch applies to the next call.
				// `$i18n` is undefined in Histoire builds, where the i18n module is not installed.
				const locale = readRequestLocale((nuxtApp as NuxtApp).$i18n);
				if (locale && !headers.has(ACCEPT_LANGUAGE_HEADER)) {
					headers.set(ACCEPT_LANGUAGE_HEADER, locale);
				}
			},
			onResponseError: ({ response }) => {
				if (!import.meta.client) return;

				// Safety net for the route guards: a business route rejected the request because
				// the account still has to add its name (e.g. the profile changed in another tab).
				// i18n uses the `no_prefix` strategy, so the paths are locale-independent.
				if (hasApiErrorCode({ response }, ApiErrorCodes.profileIncomplete)) {
					void nuxtApp.runWithContext(() => navigateTo(COMPLETE_PROFILE_PATH));
				}

				// The backend already cleared the session cookie. A full reload drops every piece of
				// in-memory state (auth, administration, cached async data) without tracking keys, and
				// its TTL collapses concurrent revoked responses into a single reload.
				if (hasApiErrorCode({ response }, ApiErrorCodes.sessionRevoked)) {
					reloadNuxtApp({ path: SIGNIN_PATH });
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
			ownershipTransfer: ownershipTransferRepository(apiFetcher),
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
