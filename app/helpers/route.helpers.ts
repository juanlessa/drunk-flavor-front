/** Separator @nuxtjs/i18n places between a route name and its locale, as in `index___pt`. */
const LOCALE_ROUTE_NAME_SEPARATOR = '___';

type KeyableRoute = {
	name?: unknown;
	path: string;
	params: Record<string, unknown>;
};

/**
 * Page key that stays the same when only the language changes. Every language has its own route
 * (`/` and `/pt`), so the default key would remount the page on a language switch and drop its
 * in-memory state; with this key Nuxt keeps the same page instance and only the texts change.
 */
export const getLocaleAgnosticPageKey = (route: KeyableRoute): string => {
	const baseName =
		typeof route.name === 'string'
			? route.name.split(LOCALE_ROUTE_NAME_SEPARATOR)[0]
			: route.path;
	return `${baseName}:${JSON.stringify(route.params)}`;
};
