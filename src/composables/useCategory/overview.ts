import type { CategoriesOverviewState } from '@/types/category';

const initState = (): CategoriesOverviewState => ({
	categories: [],
	loading: false
});

export const useCategoriesOverview = () => {
	const { $api } = useNuxtApp();

	const state = useState<CategoriesOverviewState>('categoriesOverview', initState);

	const resetOverviewState = () => {
		state.value = initState();
	};

	const fetchListingData = async () => {
		await Promise.all([getCategories()]);
	};

	const getCategories = async () => {
		try {
			state.value.loading = true;

			const response = await $api.categories.getCategories();
			state.value.categories = response;
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			state.value.loading = false;
		}
	};

	return {
		overviewState: state,
		resetOverviewState,
		fetchListingData
	};
};
