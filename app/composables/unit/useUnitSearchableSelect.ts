import type { Unit } from '~/domain/unit/unit.entity';

export const useUnitSearchableSelect = () => {
	const { $api } = useNuxtApp();

	return useSearchableSelect<Unit>({
		stateKey: 'unitSearchSelect',
		asyncDataKey: 'unitSearchableSelect',
		list: (query) => $api.units.list(query),
		errorI18nPrefix: 'organisms.unitsControlOverview'
	});
};
