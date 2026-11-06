import { watchDebounced } from '@vueuse/core';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';
import type { QueryParams } from '~/domain/shared/query.types';
import type { Language } from '~/domain/shared/translations.types';
import { buildTranslatedNameQuery } from '~/helpers/query.helpers';
import type { PaginatedOverviewState } from '~/types/overview.types';

export type UsePaginatedOverviewOptions<K extends string, T extends { id: string }> = {
	/** Key of both the `useState` state and the `useAsyncData` request. */
	key: string;
	/** Property of the state that holds the loaded items (e.g. `units`). */
	itemsKey: K;
	/** Fetches one page. */
	list: (query: QueryParams) => Promise<T[]>;
	/** Deletes one item on the server. */
	remove: (id: string) => Promise<unknown>;
	/** Prefix of the i18n keys `errorTitle` and `errorMessage`, shown when a page fails to load. */
	errorI18nPrefix: string;
};

/**
 * State and actions of a management list: paged loading by scroll, search by the localized name
 * (debounced), a restart when the language changes, and deletion.
 *
 * It is fetched in the browser only. The public drinks list is not built on it because it needs
 * its first page in the server-rendered HTML.
 */
export const usePaginatedOverview = <K extends string, T extends { id: string }>(
	options: UsePaginatedOverviewOptions<K, T>
) => {
	type State = PaginatedOverviewState<K, T>;
	// The items live under a configurable key, so reading and writing them takes one cast each.
	const getItems = (state: State) => (state as Record<K, T[]>)[options.itemsKey];
	const setItems = (state: State, items: T[]) => {
		(state as Record<K, T[]>)[options.itemsKey] = items;
	};

	const initState = (locale: Language) =>
		({
			[options.itemsKey]: [],
			filter: {
				page: 1,
				limit: 30,
				isLastPage: false,
				...buildTranslatedNameQuery('', locale)
			},
			searchTerm: '',
			loading: false
		}) as unknown as State;

	const { t, locale } = useI18n();
	const { addToast } = useToast();

	const state = useState<State>(options.key, () => initState(locale.value));

	const { data, error, status } = useAsyncData(
		options.key,
		() =>
			options.list({
				limit: state.value.filter.limit,
				page: state.value.filter.page,
				search: state.value.filter.search,
				sort: state.value.filter.sort
			}),
		{
			server: false,
			lazy: true,
			watch: [() => state.value.filter]
		}
	);

	watch(data, (newData) => {
		if (!newData) return;
		if (newData.length < state.value.filter.limit) {
			state.value.filter.isLastPage = true;
		}
		setItems(state.value, [...getItems(state.value), ...newData]);
	});
	watch(error, (newError) => {
		if (!newError) return;
		console.error(newError);
		addToast({
			type: 'error',
			title: t(`${options.errorI18nPrefix}.errorTitle`),
			message: t(`${options.errorI18nPrefix}.errorMessage`)
		});
	});
	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	const restartList = () => {
		setItems(state.value, []);
		state.value.filter = {
			...state.value.filter,
			...buildTranslatedNameQuery(state.value.searchTerm.trim(), locale.value),
			page: 1,
			isLastPage: false
		};
	};

	watchDebounced(() => state.value.searchTerm, restartList, {
		debounce: INTERACTION_TIMING_MS.searchDebounce
	});
	watch(locale, restartList);

	const resetOverviewState = () => {
		state.value = initState(locale.value);
	};

	onBeforeUnmount(() => resetOverviewState());

	const remove = async (id: string) => {
		await options.remove(id);
		setItems(
			state.value,
			getItems(state.value).filter((item) => item.id !== id)
		);
	};

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

	const isEmpty = computed(
		() => !state.value.loading && state.value.filter.isLastPage && !getItems(state.value).length
	);

	return {
		overviewState: state,
		searchTerm,
		isEmpty,
		resetOverviewState,
		remove,
		loadNextPage
	};
};
