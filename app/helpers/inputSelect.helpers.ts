import type { InputSelectOption } from '~/types/InputSelect';
import type { TranslationAnyWithNameKey, Translations, Language } from '~/types/translations';

export const mapToSelectOptions = <
	Entity extends { _id: string; translations: Translations<TranslationAnyWithNameKey> }
>(
	options: Entity[],
	lang: Language
): InputSelectOption[] => {
	return options.map((opt) => ({ label: opt.translations[lang].name, value: opt._id }));
};
