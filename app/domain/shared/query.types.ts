export type SortOrder = -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';

export type QueryParams = {
	page: number;
	limit: number;
	search?: { [k: string]: string | undefined };
	sort?: { [k: string]: SortOrder | undefined };
};

/**
 * Pagination + sort only. Used by endpoints whose backend query schema is
 * `.strict()` and rejects a `search` key (e.g. comments and ratings).
 */
export type PaginatedQueryParams = Omit<QueryParams, 'search'>;
