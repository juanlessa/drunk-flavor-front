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

export type Drink = DatabaseCommonInfo & {
	translations: Translations<DrinkTranslation>;
	cover: FileMetadata | undefined;
	thumbnail: FileMetadata | undefined;
	ingredients: DrinkIngredient[];
};
