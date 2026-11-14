/** How many drinks a person can have as favorites. Adding a new one past this is a conflict. */
export const MAX_FAVORITES_PER_USER = 1000;
/** How many favorites the list asks for at a time. */
export const FAVORITES_PAGE_SIZE = 30;
/**
 * Name of the query parameter that carries a drink to save once the person is signed in, and also the `intent`
 * the sign-in page is given, so it can say why it was asked for.
 */
export const FAVORITE_INTENT = 'favorite';
