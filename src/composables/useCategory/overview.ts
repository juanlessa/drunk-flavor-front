import type { CategoriesOverviewState } from '@/types/category';

const initState = (): CategoriesOverviewState => ({
	categories: []
});

export const useCategoriesOverview = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();

	const state = useState<CategoriesOverviewState>('categoriesOverview', initState);

	const resetOverviewState = () => {
		state.value = initState();
	};

	const getCategories = async () => {
		try {
			const response = await $api.categories.getCategories();
			state.value.categories = response;
		} catch (error) {
			console.error(error);
			addToast({ type: 'error', title: 'ERROR', message: 'error fetching categories' });
			throw error;
		}
	};

	return {
		overviewState: state,
		resetOverviewState,
		getCategories
	};
};
