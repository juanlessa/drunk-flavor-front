import type { QueryParams } from '../shared/query.types';
import type { Language } from '../shared/translations.types';
import { DRINK_SEARCH_MAX_LENGTH, DrinkListSorts } from './drink.constants';
import type { DrinkListSort } from './drink.entity';

export type DrinkListQueryInput = {
	/** What the person typed; blank means no search. */
	term: string;
	sort: DrinkListSort;
	/** Language being read: the names are sorted in it. */
	locale: Language;
};

/**
 * The search and the sort the drinks list takes for what a person picked.
 *
 * The backend rejects any other sort field than these, so a typo here is a 400 and not a silently unsorted list:
 * `ratingScore` (the average weighed by how many ratings back it), `createdAt` and the translated name.
 * The keys of a sort keep the order they are sent in: the first one sorts, the next ones break the ties.
 * The search on `name` looks in the names of every language, ignoring accents and case, and takes up to
 * `DRINK_SEARCH_MAX_LENGTH` characters.
 */
export const buildDrinkListQuery = ({
	term,
	sort,
	locale
}: DrinkListQueryInput): Pick<QueryParams, 'search' | 'sort'> => {
	const nameField = `translations.${locale}.name`;
	const trimmed = term.trim().slice(0, DRINK_SEARCH_MAX_LENGTH).trim();
	const search = trimmed ? { name: trimmed } : undefined;
	switch (sort) {
		case DrinkListSorts.name:
			return { search, sort: { [nameField]: 'asc' } };
		case DrinkListSorts.recent:
			return { search, sort: { createdAt: 'desc' } };
		case DrinkListSorts.rating:
			// The best rated first; the name breaks the ties so the order does not depend on the database.
			return { search, sort: { ratingScore: 'desc', [nameField]: 'asc' } };
	}
};
