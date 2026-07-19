import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Translations } from '../shared/translations.types';

export type CategoryTranslation = {
	name: string;
};

export type Category = DatabaseCommonInfo & {
	translations: Translations<CategoryTranslation>;
};
