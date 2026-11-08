import type { Language } from '~/domain/shared/translations.types';
import type { QueryParams } from '~/domain/shared/query.types';

/**
 * Search on the unified name (any language, ignoring accents and case) and sort on the
 * translated name of the locale, which is how the backend lists categories, units,
 * ingredients and drinks. An empty term drops the search.
 */
export const buildTranslatedNameQuery = (
	term: string,
	locale: Language
): Pick<QueryParams, 'search' | 'sort'> => {
	const nameField = `translations.${locale}.name`;
	return {
		search: term ? { name: term } : undefined,
		sort: { [nameField]: 1 }
	};
};
