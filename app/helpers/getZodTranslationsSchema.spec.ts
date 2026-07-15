import { describe, it, expect } from 'vitest';
import { z } from 'zod/v4';
import { getZodTranslationsSchema } from './getZodTranslationsSchema';

describe('getZodTranslationsSchema', () => {
	const nameSchema = z.object({ name: z.string().min(1) });

	it('returns a zod object schema with language keys', () => {
		const schema = getZodTranslationsSchema(nameSchema);
		const result = schema.safeParse({
			en: { name: 'Apple' },
			pt: { name: 'Maçã' }
		});

		expect(result.success).toBe(true);
	});

	it('fails validation when a language key is missing', () => {
		const schema = getZodTranslationsSchema(nameSchema);
		const result = schema.safeParse({
			en: { name: 'Apple' }
		});

		expect(result.success).toBe(false);
	});

	it('fails validation when nested schema fails', () => {
		const schema = getZodTranslationsSchema(nameSchema);
		const result = schema.safeParse({
			en: { name: '' },
			pt: { name: 'Maçã' }
		});

		expect(result.success).toBe(false);
	});

	it('works with different inner schemas', () => {
		const ingredientSchema = z.object({
			name: z.string().min(1),
			unit: z.string().min(1)
		});
		const schema = getZodTranslationsSchema(ingredientSchema);

		const validResult = schema.safeParse({
			en: { name: 'Rum', unit: 'ml' },
			pt: { name: 'Rum', unit: 'ml' }
		});

		expect(validResult.success).toBe(true);
	});
});
