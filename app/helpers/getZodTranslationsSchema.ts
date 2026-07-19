import { z } from 'zod/v4';
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
