import type { Locale } from '~/types/i18n.types';
import type { InputSelectOption } from './InputSelect.types';
import type { TranslationAnyWithNameKey, Translations } from '~/domain/shared/translations.types';

export const mapToSelectOptions = <
	Entity extends { id: string; translations: Translations<TranslationAnyWithNameKey> }
>(
	options: Entity[],
	lang: Locale
): InputSelectOption[] =>
	options.map((option) => ({ label: option.translations[lang].name, value: option.id }));
