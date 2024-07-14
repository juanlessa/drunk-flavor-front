export type SortOrder = -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';

export type QueryParams = {
	page: number;
	limit: number;
	search?: { [k: string]: string | undefined };
	sort?: { [k: string]: SortOrder | undefined };
};
