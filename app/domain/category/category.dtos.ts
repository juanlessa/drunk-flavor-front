import type { Translations } from '../shared/translations.types';
import type { CategoryTranslation } from './category.entity';

export type CreateCategory = {
	translations: Translations<CategoryTranslation>;
};

export type UpdateCategory = {
	id: string;
	translations: Translations<CategoryTranslation>;
};
