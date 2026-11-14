import type { FavoriteWithDrink } from './favorite.entity';
/**
 * The page asked for. Favorites are paged by a cursor, not by a page number: the first page has no `cursor`, and
 * the next ones take the `nextCursor` of the page before, as it came, since its content is the API's business.
 * `limit` is up to 50.
 */
export type FavoritesQuery = {
	limit?: number;
	cursor?: string;
};
/**
 * One page of the favorites, the newest first. A favorite whose drink no longer exists is left out, so a page may
 * hold fewer items than the limit while `nextCursor` still points to the following page. `nextCursor` is `null`
 * on the last page.
 */
export type FavoritesPage = {
	items: FavoriteWithDrink[];
	nextCursor: string | null;
};
/** The ids of every drink the person saved, the newest first. Meant for marking the drinks of a list. */
export type FavoriteDrinkIds = {
	drinkIds: string[];
};
