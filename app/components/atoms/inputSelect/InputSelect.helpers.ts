import type { Locale } from '~/types/i18n.types';
import type { InputSelectOption } from './InputSelect.types';
import type { TranslationAnyWithNameKey, Translations } from '~/domain/shared/translations.types';

export const mapToSelectOptions = <
	Entity extends { _id: string; translations: Translations<TranslationAnyWithNameKey> }
>(
	options: Entity[],
	lang: Locale
): InputSelectOption[] => {
	return options.map((opt) => ({ label: opt.translations[lang].name, value: opt._id }));
};
