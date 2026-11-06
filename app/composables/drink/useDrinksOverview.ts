import type { Drink } from '~/domain/drink/drink.entity';
import type { DrinksOverviewState } from '~/types/drink.types';

const initState = (): DrinksOverviewState => ({
	drinks: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false
	},
	loading: false
});

export const useDrinksOverview = async () => {
	const { $api } = useNuxtApp();
	const { t } = useI18n();
	const { addToast } = useToast();

	const state = useState<DrinksOverviewState>('drinksOverview', initState);

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

	const resetOverviewState = () => {
		state.value = initState();
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

	return {
		overviewState: state,
		resetOverviewState,
		loadNextPage
	};
};
