import type { UnitsOverviewState } from '~/types/unit.types';

const initState = (): UnitsOverviewState => ({
	units: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false
	},
	loading: false
});

export const useUnitsOverview = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();
	const state = useState<UnitsOverviewState>('unitsOverview', initState);

	const { data, error, status } = useAsyncData(
		'unitsOverview',
		() =>
			$api.units.list({
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
		state.value.units = [...state.value.units, ...newData];
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

	const deleteUnit = async (unitId: string) => {
		await $api.units.delete(unitId);
	};

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		state.value.filter = { ...state.value.filter, page: state.value.filter.page + 1 };
	};

	return {
		overviewState: state,
		resetOverviewState,
		deleteUnit,
		loadNextPage
	};
};
