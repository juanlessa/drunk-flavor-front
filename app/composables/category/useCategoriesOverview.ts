export const useCategoriesOverview = () => {
	const { $api } = useNuxtApp();

	const { remove, ...overview } = usePaginatedOverview({
		key: 'categoriesOverview',
		itemsKey: 'categories',
		list: (query) => $api.categories.list(query),
		remove: (id) => $api.categories.delete(id),
		errorI18nPrefix: 'organisms.categoriesControlOverview'
	});

	return { ...overview, deleteCategory: remove };
};
