/** Separator @nuxtjs/i18n places between a route name and its locale, as in `index___pt`. */
const LOCALE_ROUTE_NAME_SEPARATOR = '___';

type KeyableRoute = {
	name?: unknown;
	path: string;
	params: Record<string, unknown>;
};

/** The name of a route without the locale @nuxtjs/i18n appends to it (`bar___pt` becomes `bar`). */
export const getBaseRouteName = (name: unknown): string | undefined =>
	typeof name === 'string' ? name.split(LOCALE_ROUTE_NAME_SEPARATOR)[0] : undefined;

/**
 * Page key that stays the same when only the language changes. Every language has its own route
 * (`/` and `/pt`), so the default key would remount the page on a language switch and drop its
 * in-memory state; with this key Nuxt keeps the same page instance and only the texts change.
 */
export const getLocaleAgnosticPageKey = (route: KeyableRoute): string => {
	const baseName = getBaseRouteName(route.name) ?? route.path;
	return `${baseName}:${JSON.stringify(route.params)}`;
};
