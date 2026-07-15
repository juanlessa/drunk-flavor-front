import type { QueryParams } from './query';

export type Filter = QueryParams & {
	isLastPage: boolean;
};
