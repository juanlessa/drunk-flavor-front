import type { Filter } from '~/domain/shared/filters.types';

/**
 * State of a management list: the loaded items under `K`, plus the paging filter and the raw
 * search input (applied to `filter.search` after the debounce).
 */
export type PaginatedOverviewState<K extends string, T> = {
	[P in K]: T[];
} & {
	filter: Filter;
	searchTerm: string;
	loading: boolean;
};
