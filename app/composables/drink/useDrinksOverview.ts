import { watchDebounced } from '@vueuse/core';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';
import { DEFAULT_DRINK_LIST_SORT } from '~/domain/drink/drink.constants';
import type { Drink, DrinkListSort } from '~/domain/drink/drink.entity';
import { buildDrinkListQuery } from '~/domain/drink/drink.query';
import type { Language } from '~/domain/shared/translations.types';
import {
	buildDrinkListRouteQuery,
	isSameDrinkListRouteState,
	parseDrinkListRouteQuery,
	type DrinkListRouteState
} from '~/helpers/drinkListRoute.helpers';
import type { DrinksOverviewState } from '~/types/drink.types';

const initState = (locale: Language): DrinksOverviewState => ({
	drinks: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false,
		...buildDrinkListQuery({ term: '', sort: DEFAULT_DRINK_LIST_SORT, locale })
	},
	searchTerm: '',
	sort: DEFAULT_DRINK_LIST_SORT,
	loading: false
});

/**
 * State and actions of the public drinks list (the home): paged loading by scroll, a search by name (debounced)
 * and the order. The search and the order live in the URL (`?q=` and `?sort=`), so a refresh or a shared link
 * shows the same list.
 *
 * Unlike the management lists it is fetched on the server too, so the first page is already in the HTML.
 */
export const useDrinksOverview = async () => {
	const { $api } = useNuxtApp();
	const { t, locale } = useI18n();
	const { addToast } = useToast();
	const route = useRoute();
	const router = useRouter();
	const state = useState<DrinksOverviewState>('drinksOverview', () => initState(locale.value));

	const currentRouteState = (): DrinkListRouteState => ({
		term: state.value.searchTerm,
		sort: state.value.sort
	});

	// Starts the list over from its first page with the search and the order picked now.
	const restartList = () => {
		state.value.drinks = [];
		state.value.filter = {
			...state.value.filter,
			...buildDrinkListQuery({
				term: state.value.searchTerm,
				sort: state.value.sort,
				locale: locale.value
			}),
			page: 1,
			isLastPage: false
		};
	};

	// The search and the order the URL asks for win when they differ from the list: the first visit, a shared
	// link, the link of the logo. It runs before the first fetch, so the server renders the right list.
	const applyRouteQuery = () => {
		const fromRoute = parseDrinkListRouteQuery(route.query);
		if (isSameDrinkListRouteState(fromRoute, currentRouteState())) return;
		state.value.searchTerm = fromRoute.term;
		state.value.sort = fromRoute.sort;
		restartList();
	};
	applyRouteQuery();

	// What the list pushed to the URL, so the route watcher can tell its own navigation from someone else's.
	let pendingRouteState: DrinkListRouteState | undefined;
	const updateRoute = () => {
		const next = currentRouteState();
		if (isSameDrinkListRouteState(parseDrinkListRouteQuery(route.query), next)) return;
		pendingRouteState = next;
		void router.replace({ query: buildDrinkListRouteQuery(route.query, next) });
	};
	watch(
		() => route.query,
		() => {
			const fromRoute = parseDrinkListRouteQuery(route.query);
			if (pendingRouteState && isSameDrinkListRouteState(fromRoute, pendingRouteState)) {
				pendingRouteState = undefined;
				return;
			}
			applyRouteQuery();
		}
	);

	// Fetched on the server too, so the first page is already in the SSR HTML and in the payload.
	// The watchers and `onBeforeUnmount` below are registered before the `await`, while the component
	// instance is still the current one.
	const asyncData = useAsyncData(
		'drinksOverview',
		() =>
			$api.drinks.list({
				limit: state.value.filter.limit,
				page: state.value.filter.page,
				search: state.value.filter.search,
				sort: state.value.filter.sort
			}),
		{
			watch: [() => state.value.filter]
		}
	);
	const { data, error, status } = asyncData;

	const appendPage = (page: Drink[]) => {
		if (page.length === 0) {
			state.value.filter.isLastPage = true;
			return;
		}
		state.value.drinks = [...state.value.drinks, ...page];
	};

	watch(data, (newData) => {
		if (!newData) return;
		appendPage(newData);
	});
	watch(error, (newError) => {
		if (!newError) return;
		console.error(newError);
		addToast({
			type: 'error',
			title: t('organisms.drinksOverview.errorTitle'),
			message: t('organisms.drinksOverview.errorMessage')
		});
	});
	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	// The typed term applies after a pause, and only when it changes what is searched (a trailing space does not).
	watchDebounced(
		() => state.value.searchTerm,
		() => {
			const wanted = buildDrinkListQuery({
				term: state.value.searchTerm,
				sort: state.value.sort,
				locale: locale.value
			});
			if (JSON.stringify(wanted.search) !== JSON.stringify(state.value.filter.search))
				restartList();
			updateRoute();
		},
		{ debounce: INTERACTION_TIMING_MS.searchDebounce }
	);
	// The names are sorted in the language being read, so reading in another one asks for the list again.
	watch(
		() => locale.value,
		() => {
			if (state.value.sort === 'name') restartList();
		}
	);

	const resetOverviewState = () => {
		state.value = initState(locale.value);
	};
	onBeforeUnmount(() => resetOverviewState());

	await asyncData;
	// Watchers never run during SSR, so the first page is applied here. On the client the state
	// arrives already filled through the payload, and later pages are appended by the watcher.
	if (import.meta.server && data.value) appendPage(data.value);

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		state.value.filter = { ...state.value.filter, page: state.value.filter.page + 1 };
	};

	const searchTerm = computed({
		get: () => state.value.searchTerm,
		set: (term: string) => {
			state.value.searchTerm = term;
		}
	});
	const sort = computed<DrinkListSort>({
		get: () => state.value.sort,
		set: (newSort) => {
			if (newSort === state.value.sort) return;
			state.value.sort = newSort;
			restartList();
			updateRoute();
		}
	});
	const isSearching = computed(() => state.value.searchTerm.trim() !== '');
	// There is no total in the response: the list is known to be empty once its first page came back empty.
	const isEmpty = computed(
		() =>
			!state.value.loading && state.value.filter.isLastPage && state.value.drinks.length === 0
	);

	return {
		overviewState: state,
		searchTerm,
		sort,
		isSearching,
		isEmpty,
		resetOverviewState,
		loadNextPage
	};
};
