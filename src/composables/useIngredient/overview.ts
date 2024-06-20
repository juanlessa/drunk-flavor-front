import type { IngredientsOverviewState } from '@/types/ingredient';

const initState = (): IngredientsOverviewState => ({
	ingredients: [],
	loading: false
});

export const useIngredientsOverview = () => {
	const { $api } = useNuxtApp();

	const state = useState<IngredientsOverviewState>('ingredientsOverview', initState);

	const resetOverviewState = () => {
		state.value = initState();
	};

	const fetchListingData = async () => {
		await Promise.all([listIngredients()]);
	};

	const listIngredients = async () => {
		try {
			state.value.loading = true;

			const response = await $api.ingredients.list();
			state.value.ingredients = response;
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			state.value.loading = false;
		}
	};

	const deleteIngredient = async (id: string) => {
		await $api.ingredients.delete(id);
	};

	return {
		overviewState: state,
		resetOverviewState,
		fetchListingData,
		listIngredients,
		deleteIngredient
	};
};
