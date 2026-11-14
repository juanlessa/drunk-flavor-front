import type { LocationQuery } from 'vue-router';
import { FAVORITE_INTENT } from '~/domain/favorite/favorite.constants';
// Only used to read a relative URL, so the host never leaves this file.
const BASE_URL = 'https://drunk-flavor.local';
const DRINK_ID_PATTERN = /^[\w-]{1,64}$/;
/**
 * The page to come back to after signing in: the current one, with the drink to save in the query. Sign-in
 * only follows paths of this site, and keeps whatever else the page had (search, order, hash).
 */
export const buildFavoriteRedirect = (fullPath: string, drinkId: string): string => {
	const url = new URL(fullPath, BASE_URL);
	url.searchParams.set(FAVORITE_INTENT, drinkId);
	return `${url.pathname}${url.search}${url.hash}`;
};
/** The drink a page asks to save, or `undefined` when there is none or the value is not an id. */
export const readFavoriteIntent = (query: LocationQuery): string | undefined => {
	const value = query[FAVORITE_INTENT];
	return typeof value === 'string' && DRINK_ID_PATTERN.test(value) ? value : undefined;
};
/** The query without the drink to save, so the same request is never made twice. */
export const withoutFavoriteIntent = (query: LocationQuery): LocationQuery => {
	const rest = { ...query };
	Reflect.deleteProperty(rest, FAVORITE_INTENT);
	return rest;
};
