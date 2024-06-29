import type { CategoriesOverviewState } from '@/types/category';
import { initFilter } from '~/constants/filter';

const initState = (): CategoriesOverviewState => ({
	categories: [],
	filter: initFilter(),
	loading: false
});

export const useCategoriesOverview = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();

	const state = useState<CategoriesOverviewState>('categoriesOverview', initState);

	const { data, status } = useAsyncData(
		'categoriesOverview',
		() => {
			console.log('useAsyncData');
			return $api.categories.getCategories();
		},
		{
			server: false,
			lazy: true,
			watch: [() => state.value.filter]
		}
	);

	watch(status, (newStatus) => {
		if (newStatus === 'pending') {
			state.value.loading = true;
		} else if (newStatus === 'success' && data.value) {
			state.value.categories = [...state.value.categories, ...data.value];
			state.value.loading = false;
		} else {
			console.log('error');
			addToast({ type: 'error', title: 'ERROR!', message: 'unable to fetch data' });
			state.value.loading = false;
		}
	});

	onBeforeUnmount(() => resetOverviewState());

	const resetOverviewState = () => {
		state.value = initState();
	};

	const deleteCategory = async (categoryId: string) => {
		await $api.categories.deleteCategory(categoryId);
	};

	const nextPage = () => {
		if (state.value.filter.page <= 10) {
			state.value.filter = { ...state.value.filter, page: state.value.filter.page + 1 };
		}
	};

	return {
		overviewState: state,
		resetOverviewState,
		deleteCategory,
		nextPage
	};
};
