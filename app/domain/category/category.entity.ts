import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Translations } from '../shared/translations.types';

export type CategoryTranslation = {
	name: string;
};

/**
 * Category =
 *     _id: string
 *     translations: Translations<CategoryTranslation> ({ name } per language)
 *     is_alcoholic: boolean
 *     created_at: Date
 *     updated_at: Date
 */
export type Category = DatabaseCommonInfo & {
	translations: Translations<CategoryTranslation>;
	is_alcoholic: boolean;
};
