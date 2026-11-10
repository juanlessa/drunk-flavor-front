import type { LocationQuery, LocationQueryRaw } from 'vue-router';
import {
	DEFAULT_DRINK_LIST_SORT,
	DRINK_SEARCH_MAX_LENGTH,
	drinkListSorts
} from '~/domain/drink/drink.constants';
import type { DrinkListSort } from '~/domain/drink/drink.entity';

/** Search and sort of the home are kept in the URL, so a refresh or a shared link shows the same list. */
export const DRINK_LIST_QUERY_PARAMS = { search: 'q', sort: 'sort' } as const;

export type DrinkListRouteState = { term: string; sort: DrinkListSort };

const firstValue = (value: LocationQuery[string] | undefined): string | undefined =>
	(Array.isArray(value) ? value[0] : value) ?? undefined;

/** What the URL asks for. An unknown sort or an oversized term is dropped, so an edited URL cannot break the list. */
export const parseDrinkListRouteQuery = (query: LocationQuery): DrinkListRouteState => {
	const sort = firstValue(query[DRINK_LIST_QUERY_PARAMS.sort]);
	const term = firstValue(query[DRINK_LIST_QUERY_PARAMS.search]) ?? '';
	return {
		term: term.slice(0, DRINK_SEARCH_MAX_LENGTH),
		sort: drinkListSorts.find((option) => option === sort) ?? DEFAULT_DRINK_LIST_SORT
	};
};

/** The query of the URL for a search and a sort: the defaults are left out, and the other parameters are kept. */
export const buildDrinkListRouteQuery = (
	current: LocationQuery,
	{ term, sort }: DrinkListRouteState
): LocationQueryRaw => {
	const {
		[DRINK_LIST_QUERY_PARAMS.search]: _search,
		[DRINK_LIST_QUERY_PARAMS.sort]: _sort,
		...others
	} = current;
	const trimmed = term.trim();
	return {
		...others,
		...(trimmed ? { [DRINK_LIST_QUERY_PARAMS.search]: trimmed } : {}),
		...(sort === DEFAULT_DRINK_LIST_SORT ? {} : { [DRINK_LIST_QUERY_PARAMS.sort]: sort })
	};
};

/** Whether the URL already says what the list shows, so it is not navigated to for nothing. */
export const isSameDrinkListRouteState = (a: DrinkListRouteState, b: DrinkListRouteState) =>
	a.term.trim() === b.term.trim() && a.sort === b.sort;
