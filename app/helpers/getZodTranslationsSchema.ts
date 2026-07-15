import { z } from 'zod/v4';
import { languages } from '@/constants/translations';
import type { Language } from '~/types/translations';

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
