import type { CategoriesOverviewState } from '@/types/category';

const initState = (): CategoriesOverviewState => ({
	categories: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false
	},
	loading: false
});

export const useCategoriesOverview = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();

	const state = useState<CategoriesOverviewState>('categoriesOverview', initState);

	const { data, error, status } = useAsyncData(
		'categoriesOverview',
		() =>
			$api.categories.list({
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
		state.value.categories = [...state.value.categories, ...newData];
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

	const deleteCategory = async (categoryId: string) => {
		await $api.categories.delete(categoryId);
	};

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		state.value.filter = { ...state.value.filter, page: state.value.filter.page + 1 };
	};

	return {
		overviewState: state,
		resetOverviewState,
		deleteCategory,
		loadNextPage
	};
};
