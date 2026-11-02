import { describe, it, expect } from 'vitest';
import { mapToSelectOptions } from './InputSelect.helpers';

describe('mapToSelectOptions', () => {
	const entities = [
		{ id: '1', translations: { en: { name: 'Apple' }, pt: { name: 'Maçã' } } },
		{ id: '2', translations: { en: { name: 'Banana' }, pt: { name: 'Banana' } } },
		{ id: '3', translations: { en: { name: 'Cherry' }, pt: { name: 'Cereja' } } }
	];

	it('maps entities to select options with correct label and value', () => {
		const result = mapToSelectOptions(entities, 'en');

		expect(result).toEqual([
			{ label: 'Apple', value: '1' },
			{ label: 'Banana', value: '2' },
			{ label: 'Cherry', value: '3' }
		]);
	});

	it('uses the correct language for labels', () => {
		const result = mapToSelectOptions(entities, 'pt');

		expect(result).toEqual([
			{ label: 'Maçã', value: '1' },
			{ label: 'Banana', value: '2' },
			{ label: 'Cereja', value: '3' }
		]);
	});

	it('returns empty array when input is empty', () => {
		const result = mapToSelectOptions([], 'en');

		expect(result).toEqual([]);
	});

	it('preserves entity id as option value', () => {
		const result = mapToSelectOptions(entities, 'en');

		result.forEach((option, index) => {
			expect(option.value).toBe(entities[index]!.id);
		});
	});
});
