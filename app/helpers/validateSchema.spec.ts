import { describe, it, expect } from 'vitest';
import { z } from 'zod/v4';
import { validateSchema } from './validateSchema';

describe('validateSchema', () => {
	const schema = z.object({
		name: z.string().min(1),
		email: z.string().email()
	});

	type FormData = { name: string; email: string };
	const validator = validateSchema<FormData>(schema);

	it('returns empty array when data is valid', () => {
		const result = validator({ name: 'John', email: 'john@test.com' });

		expect(result).toEqual([]);
	});

	it('returns field errors when data is invalid', () => {
		const result = validator({ name: '', email: 'invalid' });

		expect(result.length).toBeGreaterThan(0);
	});

	it('returns correct field path for each error', () => {
		const result = validator({ name: '', email: 'john@test.com' });

		expect(result).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'name' })])
		);
	});

	it('returns error message for each issue', () => {
		const result = validator({ name: '', email: 'invalid' });

		result.forEach((error) => {
			expect(error.message).toBeTruthy();
			expect(typeof error.message).toBe('string');
		});
	});

	it('handles nested object schemas', () => {
		const nestedSchema = z.object({
			translations: z.object({
				en: z.object({ name: z.string().min(1) })
			})
		});
		type NestedData = { translations: { en: { name: string } } };
		const nestedValidator = validateSchema<NestedData>(nestedSchema);

		const result = nestedValidator({ translations: { en: { name: '' } } });

		expect(result).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'translations.en.name' })])
		);
	});
});
