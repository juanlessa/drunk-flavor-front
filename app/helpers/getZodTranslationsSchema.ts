import { z } from 'zod';
import { languages } from '@/constants/translations';
import type { Language } from '~/types/translations';

export const getZodTranslationsSchema = (schema: z.ZodTypeAny) => {
	const translationsSchema = languages.reduce(
		(acc, lang) => {
			acc[lang] = schema;
			return acc;
		},
		{} as Record<Language, z.ZodTypeAny>
	);

	return z.object(translationsSchema);
};
