import type { Filter } from '~/types/filters';

export const initFilter = (): Filter => ({
	page: 1,
	limit: 10
});
