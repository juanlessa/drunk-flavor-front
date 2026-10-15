import type { QueryParams } from './query.types';

export type Filter = QueryParams & {
	isLastPage: boolean;
};
