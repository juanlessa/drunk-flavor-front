import type { DrinksOverviewState } from '~/types/drink';

const initState = (): DrinksOverviewState => ({
	drinks: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false
	},
	loading: false
});

export const useDrinksOverview = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();

	const state = useState<DrinksOverviewState>('drinksOverview', initState);

	const { data, error, status } = useAsyncData(
		'drinksOverview',
		() =>
			$api.drinks.list({
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
		if (newData.length === 0) {
			state.value.filter.isLastPage = true;
			return;
		}
		state.value.drinks = [...state.value.drinks, ...newData];
	});
	watch(error, (newError) => {
		if (!newError) return;
		console.error(newError);
		addToast({ type: 'error', title: 'ERROR!', message: 'unable to fetch data' });
	});
	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	const resetOverviewState = () => {
		state.value = initState();
	};

	onBeforeUnmount(() => resetOverviewState());

	const deleteDrink = async (drinkId: string) => {
		await $api.drinks.delete(drinkId);
	};

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		state.value.filter = { ...state.value.filter, page: state.value.filter.page + 1 };
	};

	return {
		overviewState: state,
		resetOverviewState,
		deleteDrink,
		loadNextPage
	};
};
