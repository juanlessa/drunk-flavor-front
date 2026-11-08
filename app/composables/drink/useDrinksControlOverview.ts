/**
 * Drinks management list (/drinks). Kept apart from `useDrinksOverview`, which
 * feeds the public home grid, is rendered on the server and keeps the backend's default order.
 */
export const useDrinksControlOverview = () => {
	const { $api } = useNuxtApp();

	const { remove, ...overview } = usePaginatedOverview({
		key: 'drinksControlOverview',
		itemsKey: 'drinks',
		list: (query) => $api.drinks.list(query),
		remove: (id) => $api.drinks.delete(id),
		errorI18nPrefix: 'organisms.drinksControlOverview'
	});

	return { ...overview, deleteDrink: remove };
};
