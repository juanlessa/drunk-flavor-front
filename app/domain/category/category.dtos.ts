import type { Translations } from '../shared/translations.types';
import type { CategoryTranslation } from './category.entity';

export type CreateCategory = {
	translations: Translations<CategoryTranslation>;
	is_alcoholic: boolean;
};

export type UpdateCategory = CreateCategory & {
	id: string;
};
