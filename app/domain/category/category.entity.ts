import type { EntityMetadata } from '../shared/entity.types';
import type { Translations } from '../shared/translations.types';

export type CategoryTranslation = { name: string };

export type Category = EntityMetadata & {
	translations: Translations<CategoryTranslation>;
	isAlcoholic: boolean;
};
