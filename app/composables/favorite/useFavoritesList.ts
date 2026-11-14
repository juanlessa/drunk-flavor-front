import { FAVORITES_PAGE_SIZE } from '~/domain/favorite/favorite.constants';
import type { FavoriteWithDrink } from '~/domain/favorite/favorite.entity';
/**
 * The favorites of the signed-in person, a page at a time, the newest first, each with its drink. It loads the
 * first page when the component mounts, so use it where the person is known to be signed in.
 *
 * The next page is asked with the cursor of the page before, as the API gave it. A drink that stops being a
 * favorite stays in the list until the next visit, so a tap on its heart can be undone.
 */
export const useFavoritesList = () => {
	const { $api } = useNuxtApp();
	const { t } = useI18n();
	const { addToast } = useToast();
	// Replaced as a whole on every page, never changed in place, so it needs no deep reactivity.
	const items = shallowRef<FavoriteWithDrink[]>([]);
	const nextCursor = ref<string | null>(null);
	const loading = ref(false);
	/** Whether the first page arrived, so an empty list means "no favorites". */
	const hasLoaded = ref(false);
	const hasLoadError = ref(false);
	let controller: AbortController | undefined;
	const fetchPage = async (cursor?: string) => {
		controller?.abort();
		const current = new AbortController();
		controller = current;
		loading.value = true;
		try {
			const page = await $api.favorites.list(
				{ limit: FAVORITES_PAGE_SIZE, ...(cursor !== undefined && { cursor }) },
				{ signal: current.signal }
			);
			if (current.signal.aborted) return;
			const known = new Set(items.value.map(({ id }) => id));
			items.value = [...items.value, ...page.items.filter(({ id }) => !known.has(id))];
			nextCursor.value = page.nextCursor;
			hasLoaded.value = true;
			hasLoadError.value = false;
		} catch (error) {
			if (current.signal.aborted) return;
			console.error(error);
			if (hasLoaded.value) {
				addToast({
					type: 'error',
					title: t('organisms.favorites.toast.errorTitle'),
					message: t('organisms.favorites.toast.loadError')
				});
			} else {
				hasLoadError.value = true;
			}
		} finally {
			if (controller === current) loading.value = false;
		}
	};
	/** Starts over from the first page. */
	const load = async () => {
		items.value = [];
		nextCursor.value = null;
		hasLoaded.value = false;
		hasLoadError.value = false;
		await fetchPage();
	};
	/** Asks for the next page; ignored while one is loading, before the first one, and after the last. */
	const loadMore = () => {
		if (loading.value || !hasLoaded.value || nextCursor.value === null) return;
		void fetchPage(nextCursor.value);
	};
	onMounted(() => void load());
	onScopeDispose(() => controller?.abort());
	return {
		items: computed(() => items.value),
		loading: computed(() => loading.value),
		hasLoaded: computed(() => hasLoaded.value),
		hasLoadError: computed(() => hasLoadError.value),
		isLastPage: computed(() => hasLoaded.value && nextCursor.value === null),
		load,
		loadMore
	};
};
