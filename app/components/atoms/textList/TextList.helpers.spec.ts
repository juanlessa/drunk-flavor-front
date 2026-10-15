import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateMarker } from './TextList.helpers';

describe('validateMarker', () => {
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	describe('unordered list (ul)', () => {
		it('accepts "none" for ul', () => {
			expect(validateMarker('none', { as: 'ul' })).toBe(true);
		});

		it('accepts "disc" for ul', () => {
			expect(validateMarker('disc', { as: 'ul' })).toBe(true);
		});

		it('accepts "circle" for ul', () => {
			expect(validateMarker('circle', { as: 'ul' })).toBe(true);
		});

		it('accepts "square" for ul', () => {
			expect(validateMarker('square', { as: 'ul' })).toBe(true);
		});

		it('rejects "decimal" for ul', () => {
			expect(validateMarker('decimal', { as: 'ul' })).toBe(false);
		});

		it('rejects "lower-alpha" for ul', () => {
			expect(validateMarker('lower-alpha', { as: 'ul' })).toBe(false);
		});

		it('rejects "upper-roman" for ul', () => {
			expect(validateMarker('upper-roman', { as: 'ul' })).toBe(false);
		});

		it('warns when marker is invalid for ul', () => {
			validateMarker('decimal', { as: 'ul' });

			expect(console.warn).toHaveBeenCalledWith(
				expect.stringContaining('marker "decimal" is not valid for type "ul"')
			);
		});
	});

	describe('ordered list (ol)', () => {
		it('accepts "none" for ol', () => {
			expect(validateMarker('none', { as: 'ol' })).toBe(true);
		});

		it('accepts "decimal" for ol', () => {
			expect(validateMarker('decimal', { as: 'ol' })).toBe(true);
		});

		it('accepts "decimal-leading-zero" for ol', () => {
			expect(validateMarker('decimal-leading-zero', { as: 'ol' })).toBe(true);
		});

		it('accepts "lower-alpha" for ol', () => {
			expect(validateMarker('lower-alpha', { as: 'ol' })).toBe(true);
		});

		it('accepts "upper-alpha" for ol', () => {
			expect(validateMarker('upper-alpha', { as: 'ol' })).toBe(true);
		});

		it('accepts "lower-roman" for ol', () => {
			expect(validateMarker('lower-roman', { as: 'ol' })).toBe(true);
		});

		it('accepts "upper-roman" for ol', () => {
			expect(validateMarker('upper-roman', { as: 'ol' })).toBe(true);
		});

		it('rejects "disc" for ol', () => {
			expect(validateMarker('disc', { as: 'ol' })).toBe(false);
		});

		it('rejects "circle" for ol', () => {
			expect(validateMarker('circle', { as: 'ol' })).toBe(false);
		});

		it('rejects "square" for ol', () => {
			expect(validateMarker('square', { as: 'ol' })).toBe(false);
		});
	});

	describe('default type (no type provided)', () => {
		it('defaults to ul validation when type is undefined', () => {
			expect(validateMarker('disc', {})).toBe(true);
			expect(validateMarker('decimal', {})).toBe(false);
		});
	});
});

