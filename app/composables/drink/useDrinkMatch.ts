import type { DrinkMatch, DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';

export const DRINK_MATCH_PAGE_SIZE = 20;

/**
 * The drinks that can be made with the given ingredients, a page at a time, the most complete first.
 *
 * A change of the ingredients or of the way to match starts over from the first page. Only the latest request
 * counts: an older one still on its way is cancelled, so a slow answer never replaces a newer list. With no
 * ingredient there is nothing to match, and nothing is requested.
 */
export const useDrinkMatch = (
	ingredientIds: MaybeRefOrGetter<string[]>,
	maxMissing: MaybeRefOrGetter<DrinkMatchMaxMissing>
) => {
	const { $api } = useNuxtApp();
	const { t } = useI18n();
	const { addToast } = useToast();

	// Replaced as a whole on every page, never changed in place, so it needs no deep reactivity.
	const matches = shallowRef<DrinkMatch[]>([]);
	const page = ref(0);
	const isLastPage = ref(false);
	const loading = ref(false);
	/** Whether the first page of the current search arrived, so an empty list means "nothing found". */
	const hasLoaded = ref(false);
	let controller: AbortController | undefined;

	const fetchPage = async (pageToLoad: number) => {
		controller?.abort();
		const current = new AbortController();
		controller = current;
		loading.value = true;
		try {
			const { items } = await $api.drinks.match(
				{ ingredientIds: toValue(ingredientIds), maxMissing: toValue(maxMissing) },
				{ page: pageToLoad, limit: DRINK_MATCH_PAGE_SIZE },
				{ signal: current.signal }
			);
			if (current.signal.aborted) return;
			matches.value = pageToLoad === 1 ? items : [...matches.value, ...items];
			page.value = pageToLoad;
			isLastPage.value = items.length < DRINK_MATCH_PAGE_SIZE;
			hasLoaded.value = true;
		} catch (error) {
			if (current.signal.aborted) return;
			console.error(error);
			addToast({
				type: 'error',
				title: t('organisms.myBar.errorTitle'),
				message: t('organisms.myBar.errorMessage')
			});
		} finally {
			if (controller === current) loading.value = false;
		}
	};

	const restart = () => {
		controller?.abort();
		matches.value = [];
		page.value = 0;
		isLastPage.value = false;
		hasLoaded.value = false;
		loading.value = false;
		if (toValue(ingredientIds).length === 0) return;
		void fetchPage(1);
	};

	// The ids are compared as text, so the same ingredients in a new array do not start over.
	watch([() => toValue(ingredientIds).join(','), () => toValue(maxMissing)], restart, {
		immediate: true
	});

	/** Asks for the next page; ignored while one is loading, before the first one, and after the last. */
	const loadNextPage = () => {
		if (loading.value || isLastPage.value || !hasLoaded.value) return;
		void fetchPage(page.value + 1);
	};

	onScopeDispose(() => controller?.abort());

	return {
		matches: computed(() => matches.value),
		isLastPage: computed(() => isLastPage.value),
		loading: computed(() => loading.value),
		hasLoaded: computed(() => hasLoaded.value),
		loadNextPage
	};
};
