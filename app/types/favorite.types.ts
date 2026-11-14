export type FavoritesStatus = 'idle' | 'loading' | 'ready' | 'error';
/** What the whole app shares about the favorites of the signed-in person. */
export type FavoritesState = {
	/** Ids of every favorite drink, the newest first. */
	ids: string[];
	status: FavoritesStatus;
	/** Ids with a request on its way: a second tap on them is ignored. */
	pendingIds: string[];
};
/**
 * What happened after a tap on a heart:
 * - `signin`: the person is signed out and was sent to sign in;
 * - `busy`: a request for the same drink is still on its way;
 * - `limit`: the person reached the limit of favorites;
 * - `failed`: the request failed and the heart went back.
 */
export type FavoriteResult = 'added' | 'removed' | 'signin' | 'busy' | 'limit' | 'failed';
