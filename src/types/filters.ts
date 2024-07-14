export type SortOrder = -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';

export type Filter = {
	page: number;
	limit: number;
	isLastPage: boolean;
	search?: { [k: string]: string | undefined };
	sort?: { [k: string]: SortOrder | undefined };
};
