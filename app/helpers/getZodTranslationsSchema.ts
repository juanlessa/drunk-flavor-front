import { z } from 'zod/v4';
import { isGenderedLanguage } from '~/domain/shared/gender.helpers';
import { languages } from '~/domain/shared/translations.constants';
import type { Language } from '~/domain/shared/translations.types';

export const getZodTranslationsSchema = (schema: z.ZodType) => {
	const translationsSchema = languages.reduce(
		(acc, lang) => {
			acc[lang] = schema;
			return acc;
		},
		{} as Record<Language, z.ZodType>
	);
	return z.object(translationsSchema);
};

/**
 * Like `getZodTranslationsSchema`, but the languages that need a grammatical gender also require the
 * `gender` field, validated by `genderSchema`. The other languages keep the plain schema.
 */
export const getZodGenderedTranslationsSchema = (schema: z.ZodObject, genderSchema: z.ZodType) => {
	const translationsSchema = languages.reduce(
		(acc, lang) => {
			acc[lang] = isGenderedLanguage(lang) ? schema.extend({ gender: genderSchema }) : schema;
			return acc;
		},
		{} as Record<Language, z.ZodType>
	);
	return z.object(translationsSchema);
};
