import type { Ingredient } from '../ingredient/ingredient.entity';
import type { EntityMetadata } from '../shared/entity.types';
import type { Translations } from '../shared/translations.types';

export type DrinkTranslation = { name: string; method: string };
export type FileMetadata = { name: string; mimetype: string; url: string };
export type DrinkIngredient = { quantity: number; ingredient: Ingredient };

export type Drink = EntityMetadata & {
	translations: Translations<DrinkTranslation>;
	cover?: FileMetadata;
	thumbnail?: FileMetadata;
	ingredients: DrinkIngredient[];
	avgRating: number;
	ratingsCount: number;
};
