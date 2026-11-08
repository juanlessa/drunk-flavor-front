import { describe, expect, it } from 'vitest';
import { isGenderedLanguage } from './gender.helpers';

describe('isGenderedLanguage', () => {
	it('is true for Portuguese, where the backend requires the gender', () => {
		expect(isGenderedLanguage('pt')).toBe(true);
	});

	it('is false for English, which does not need it', () => {
		expect(isGenderedLanguage('en')).toBe(false);
	});
});
