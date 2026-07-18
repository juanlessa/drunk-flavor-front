import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateMarker, validateReversed } from './textList.helpers';

describe('validateMarker', () => {
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	describe('unordered list (ul)', () => {
		it('accepts "none" for ul', () => {
			expect(validateMarker('none', { type: 'ul' })).toBe(true);
		});

		it('accepts "disc" for ul', () => {
			expect(validateMarker('disc', { type: 'ul' })).toBe(true);
		});

		it('accepts "circle" for ul', () => {
			expect(validateMarker('circle', { type: 'ul' })).toBe(true);
		});

		it('accepts "square" for ul', () => {
			expect(validateMarker('square', { type: 'ul' })).toBe(true);
		});

		it('rejects "decimal" for ul', () => {
			expect(validateMarker('decimal', { type: 'ul' })).toBe(false);
		});

		it('rejects "lower-alpha" for ul', () => {
			expect(validateMarker('lower-alpha', { type: 'ul' })).toBe(false);
		});

		it('rejects "upper-roman" for ul', () => {
			expect(validateMarker('upper-roman', { type: 'ul' })).toBe(false);
		});

		it('warns when marker is invalid for ul', () => {
			validateMarker('decimal', { type: 'ul' });

			expect(console.warn).toHaveBeenCalledWith(
				expect.stringContaining('marker "decimal" is not valid for type "ul"')
			);
		});
	});

	describe('ordered list (ol)', () => {
		it('accepts "none" for ol', () => {
			expect(validateMarker('none', { type: 'ol' })).toBe(true);
		});

		it('accepts "decimal" for ol', () => {
			expect(validateMarker('decimal', { type: 'ol' })).toBe(true);
		});

		it('accepts "decimal-leading-zero" for ol', () => {
			expect(validateMarker('decimal-leading-zero', { type: 'ol' })).toBe(true);
		});

		it('accepts "lower-alpha" for ol', () => {
			expect(validateMarker('lower-alpha', { type: 'ol' })).toBe(true);
		});

		it('accepts "upper-alpha" for ol', () => {
			expect(validateMarker('upper-alpha', { type: 'ol' })).toBe(true);
		});

		it('accepts "lower-roman" for ol', () => {
			expect(validateMarker('lower-roman', { type: 'ol' })).toBe(true);
		});

		it('accepts "upper-roman" for ol', () => {
			expect(validateMarker('upper-roman', { type: 'ol' })).toBe(true);
		});

		it('rejects "disc" for ol', () => {
			expect(validateMarker('disc', { type: 'ol' })).toBe(false);
		});

		it('rejects "circle" for ol', () => {
			expect(validateMarker('circle', { type: 'ol' })).toBe(false);
		});

		it('rejects "square" for ol', () => {
			expect(validateMarker('square', { type: 'ol' })).toBe(false);
		});
	});

	describe('default type (no type provided)', () => {
		it('defaults to ul validation when type is undefined', () => {
			expect(validateMarker('disc', {})).toBe(true);
			expect(validateMarker('decimal', {})).toBe(false);
		});
	});
});

describe('validateReversed', () => {
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	it('accepts reversed=true for ol', () => {
		expect(validateReversed(true, { type: 'ol' })).toBe(true);
	});

	it('accepts reversed=false for any type', () => {
		expect(validateReversed(false, { type: 'ul' })).toBe(true);
		expect(validateReversed(false, { type: 'ol' })).toBe(true);
	});

	it('rejects reversed=true for ul', () => {
		expect(validateReversed(true, { type: 'ul' })).toBe(false);
	});

	it('rejects reversed=true when type is undefined (defaults to ul)', () => {
		expect(validateReversed(true, {})).toBe(false);
	});

	it('warns when reversed is used with ul', () => {
		validateReversed(true, { type: 'ul' });

		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('"reversed" can only be used with type "ol"')
		);
	});
});
