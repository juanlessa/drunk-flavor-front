import { FAVORITE_INTENT } from '~/domain/favorite/favorite.constants';
import { readFavoriteIntent, withoutFavoriteIntent } from '~/helpers/favorite.helpers';
/**
 * Keeps the favorites in step with the session and finishes what a signed-out person started: call it once,
 * in the root of the app.
 *
 * - Signing in loads the favorites; signing out forgets them.
 * - A page opened with `?favorite=<drink id>` (the tap on a heart before signing in) saves that drink once the
 *   person is signed in, takes the parameter out of the address and says it was saved.
 */
export const useFavoritesSync = () => {
	const { $auth } = useNuxtApp();
	const { t } = useI18n();
	const { addToast } = useToast();
	const route = useRoute();
	const router = useRouter();
	const favorites = useFavorites();
	const isAuthenticated = computed(() => $auth.state.value.isAuthenticated);
	const resumeIntent = async () => {
		const drinkId = readFavoriteIntent(route.query);
		if (!drinkId || !isAuthenticated.value) return;
		// The address is cleaned first, so a reload or a second run never saves the drink again.
		await router.replace({ query: withoutFavoriteIntent(route.query), hash: route.hash });
		if ((await favorites.add(drinkId)) === 'added') {
			addToast({
				type: 'info',
				title: t('organisms.favorites.toast.resumedTitle'),
				message: t('organisms.favorites.toast.resumed')
			});
		}
	};
	watch(isAuthenticated, (signedIn) => {
		if (!signedIn) {
			favorites.reset();
			return;
		}
		void favorites.load();
		void resumeIntent();
	});
	watch(
		() => route.query[FAVORITE_INTENT],
		() => void resumeIntent()
	);
	onMounted(() => {
		if (!isAuthenticated.value) return;
		void favorites.load();
		void resumeIntent();
	});
};
