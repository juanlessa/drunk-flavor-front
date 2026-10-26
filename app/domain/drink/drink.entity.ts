import type { Ingredient } from '../ingredient/ingredient.entity';
import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Translations } from '../shared/translations.types';

export type DrinkTranslation = {
	name: string;
	method: string;
};

export type FileMetadata = {
	name: string;
	mimetype: string;
	url: string;
};

export type DrinkIngredient = {
	quantity: number;
	ingredient: Ingredient;
};

/**
 * Drink =
 *     _id: string
 *     translations: Translations<DrinkTranslation> ({ name, method } per language)
 *     cover: FileMetadata | undefined
 *     thumbnail: FileMetadata | undefined
 *     ingredients: DrinkIngredient[] ({ quantity, ingredient } with populated ingredient)
 *     avg_rating: number (aggregated from ratings; 0 when there are none)
 *     ratings_count: number
 *     created_at: Date
 *     updated_at: Date
 */
export type Drink = DatabaseCommonInfo & {
	translations: Translations<DrinkTranslation>;
	cover: FileMetadata | undefined;
	thumbnail: FileMetadata | undefined;
	ingredients: DrinkIngredient[];
	avg_rating: number;
	ratings_count: number;
};
