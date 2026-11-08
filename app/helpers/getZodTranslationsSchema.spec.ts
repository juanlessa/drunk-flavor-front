import { describe, it, expect } from 'vitest';
import { z } from 'zod/v4';
import {
	getZodGenderedTranslationsSchema,
	getZodTranslationsSchema
} from './getZodTranslationsSchema';

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

describe('getZodGenderedTranslationsSchema', () => {
	const nameSchema = z.object({ name: z.string().min(1) });
	const genderSchema = z.enum(['masculine', 'feminine'], { error: 'gender.required' });
	const schema = getZodGenderedTranslationsSchema(nameSchema, genderSchema);

	it('requires the gender only in the languages that need it', () => {
		const result = schema.safeParse({ en: { name: 'Gin' }, pt: { name: 'Gin' } });

		expect(!result.success && result.error.issues.map(({ path }) => path)).toEqual([
			['pt', 'gender']
		]);
	});

	it('accepts the gender in the language that needs it and its absence in the others', () => {
		expect(
			schema.safeParse({ en: { name: 'Gin' }, pt: { name: 'Gin', gender: 'masculine' } })
				.success
		).toBe(true);
	});

	it('rejects a gender that does not exist, with the given message', () => {
		const result = schema.safeParse({
			en: { name: 'Gin' },
			pt: { name: 'Gin', gender: 'neuter' }
		});

		expect(!result.success && result.error.issues.map(({ message }) => message)).toEqual([
			'gender.required'
		]);
	});

	it('keeps validating the other fields', () => {
		const result = schema.safeParse({
			en: { name: '' },
			pt: { name: 'Gin', gender: 'masculine' }
		});

		expect(result.success).toBe(false);
	});
});
