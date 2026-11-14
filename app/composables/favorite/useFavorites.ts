import { FAVORITE_INTENT, MAX_FAVORITES_PER_USER } from '~/domain/favorite/favorite.constants';
import { buildFavoriteRedirect } from '~/helpers/favorite.helpers';
import type { FavoriteResult, FavoritesState } from '~/types/favorite.types';
const CONFLICT_STATUS = 409;
const initState = (): FavoritesState => ({ ids: [], status: 'idle', pendingIds: [] });
const getStatus = (error: unknown): number | undefined => {
	const { response, statusCode, status } = (error ?? {}) as {
		response?: { status?: number };
		statusCode?: number;
		status?: number;
	};
	return response?.status ?? statusCode ?? status;
};
/**
 * The favorite drinks of the signed-in person, shared by every heart on the page: one request fills it, and a tap
 * changes it at once (before the answer) and goes back when the request fails.
 *
 * It only knows the person after the session is known in the browser, so a heart renders as "not a favorite"
 * until then. `useFavoritesSync` keeps it in step with the session.
 */
export const useFavorites = () => {
	const { $api, $auth } = useNuxtApp();
	const { t, locale } = useI18n();
	const { addToast } = useToast();
	const route = useRoute();
	const localePath = useLocalePath();
	const state = useState<FavoritesState>('favorites', initState);
	const isAuthenticated = computed(() => $auth.state.value.isAuthenticated);
	const isFavorite = (drinkId: string) => state.value.ids.includes(drinkId);
	const isPending = (drinkId: string) => state.value.pendingIds.includes(drinkId);
	const toastError = (message: string, title = t('organisms.favorites.toast.errorTitle')) =>
		addToast({ type: 'error', title, message });
	/** Fills the ids from the API. Asked again while loading or after it worked, it does nothing. */
	const load = async (): Promise<boolean> => {
		if (state.value.status === 'loading' || state.value.status === 'ready') return true;
		state.value.status = 'loading';
		try {
			const { drinkIds } = await $api.favorites.listDrinkIds();
			state.value.ids = drinkIds;
			state.value.status = 'ready';
			return true;
		} catch (error) {
			console.error(error);
			state.value.status = 'error';
			toastError(t('organisms.favorites.toast.loadError'));
			return false;
		}
	};
	/** Forgets everything: used when the person signs out, so the next one does not see these hearts. */
	const reset = () => {
		state.value = initState();
	};
	const setPending = (drinkId: string, pending: boolean) => {
		state.value.pendingIds = pending
			? [...state.value.pendingIds, drinkId]
			: state.value.pendingIds.filter((id) => id !== drinkId);
	};
	const add = async (drinkId: string): Promise<FavoriteResult> => {
		if (isPending(drinkId)) return 'busy';
		setPending(drinkId, true);
		const wasFavorite = isFavorite(drinkId);
		if (!wasFavorite) state.value.ids = [drinkId, ...state.value.ids];
		try {
			await $api.favorites.add(drinkId);
			return 'added';
		} catch (error) {
			console.error(error);
			if (!wasFavorite) state.value.ids = state.value.ids.filter((id) => id !== drinkId);
			if (getStatus(error) === CONFLICT_STATUS) {
				toastError(
					t('organisms.favorites.toast.limit', {
						max: new Intl.NumberFormat(
							locale.value === 'pt' ? 'pt-BR' : 'en-US'
						).format(MAX_FAVORITES_PER_USER)
					}),
					t('organisms.favorites.toast.limitTitle')
				);
				return 'limit';
			}
			toastError(t('organisms.favorites.toast.error'));
			return 'failed';
		} finally {
			setPending(drinkId, false);
		}
	};
	const remove = async (drinkId: string): Promise<FavoriteResult> => {
		if (isPending(drinkId)) return 'busy';
		setPending(drinkId, true);
		const wasFavorite = isFavorite(drinkId);
		state.value.ids = state.value.ids.filter((id) => id !== drinkId);
		try {
			await $api.favorites.remove(drinkId);
			return 'removed';
		} catch (error) {
			console.error(error);
			if (wasFavorite) state.value.ids = [drinkId, ...state.value.ids];
			toastError(t('organisms.favorites.toast.error'));
			return 'failed';
		} finally {
			setPending(drinkId, false);
		}
	};
	/**
	 * What a tap on a heart does: a signed-out person is sent to sign in and brought back to this page with the
	 * drink to save; a signed-in one saves the drink, or removes it when it already is a favorite.
	 */
	const toggle = async (drinkId: string): Promise<FavoriteResult> => {
		if (!isAuthenticated.value) {
			await navigateTo({
				path: localePath('/signin').toString(),
				query: {
					redirect: buildFavoriteRedirect(route.fullPath, drinkId),
					intent: FAVORITE_INTENT
				}
			});
			return 'signin';
		}
		return isFavorite(drinkId) ? remove(drinkId) : add(drinkId);
	};
	return { state, isAuthenticated, isFavorite, isPending, load, reset, add, remove, toggle };
};
