import type { Language } from '~/domain/shared/translations.types';
import type { QueryParams } from '~/domain/shared/query.types';

/**
 * Search and sort on the translated name, which is how the backend lists
 * categories, units, ingredients and drinks. An empty term drops the search.
 */
export const buildTranslatedNameQuery = (
	term: string,
	locale: Language
): Pick<QueryParams, 'search' | 'sort'> => {
	const nameField = `translations.${locale}.name`;
	return {
		search: term ? { [nameField]: term } : undefined,
		sort: { [nameField]: 1 }
	};
};
