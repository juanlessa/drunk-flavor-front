export const useUnitsOverview = () => {
	const { $api } = useNuxtApp();

	const { remove, ...overview } = usePaginatedOverview({
		key: 'unitsOverview',
		itemsKey: 'units',
		list: (query) => $api.units.list(query),
		remove: (id) => $api.units.delete(id),
		errorI18nPrefix: 'organisms.unitsControlOverview'
	});

	return { ...overview, deleteUnit: remove };
};
