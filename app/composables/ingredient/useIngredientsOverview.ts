export const useIngredientsOverview = () => {
	const { $api } = useNuxtApp();

	const { remove, ...overview } = usePaginatedOverview({
		key: 'ingredientsOverview',
		itemsKey: 'ingredients',
		list: (query) => $api.ingredients.list(query),
		remove: (id) => $api.ingredients.delete(id),
		errorI18nPrefix: 'organisms.ingredientsControlOverview'
	});

	return { ...overview, deleteIngredient: remove };
};
