import { describe, it, expect } from 'vitest';
import {
	hasMinMaxLength,
	hasLowercase,
	hasUppercase,
	hasDigit,
	hasSpecialChar,
	countMetCriteria,
	levelFromMet,
	computeStrength
} from './PasswordStrength.helpers';

describe('PasswordStrength.helpers', () => {
	describe('hasMinMaxLength', () => {
		it('rejects passwords shorter than 8 characters', () => {
			expect(hasMinMaxLength('abc')).toBe(false);
			expect(hasMinMaxLength('1234567')).toBe(false);
		});

		it('accepts passwords between 8 and 64 characters', () => {
			expect(hasMinMaxLength('12345678')).toBe(true);
			expect(hasMinMaxLength('a'.repeat(64))).toBe(true);
		});

		it('rejects passwords longer than 64 characters', () => {
			expect(hasMinMaxLength('a'.repeat(65))).toBe(false);
		});
	});

	describe('hasLowercase', () => {
		it('detects a lowercase letter', () => {
			expect(hasLowercase('ABCd')).toBe(true);
		});

		it('returns false without a lowercase letter', () => {
			expect(hasLowercase('ABC123')).toBe(false);
		});
	});

	describe('hasUppercase', () => {
		it('detects an uppercase letter', () => {
			expect(hasUppercase('abcD')).toBe(true);
		});

		it('returns false without an uppercase letter', () => {
			expect(hasUppercase('abc123')).toBe(false);
		});
	});

	describe('hasDigit', () => {
		it('detects a digit', () => {
			expect(hasDigit('abc1')).toBe(true);
		});

		it('returns false without a digit', () => {
			expect(hasDigit('abcDEF')).toBe(false);
		});
	});

	describe('hasSpecialChar', () => {
		it('detects a special character from the allowed set', () => {
			expect(hasSpecialChar('abc!')).toBe(true);
			expect(hasSpecialChar('abc`')).toBe(true);
		});

		it('returns false without a special character', () => {
			expect(hasSpecialChar('abc123')).toBe(false);
		});
	});

	describe('countMetCriteria', () => {
		it('returns 0 for an empty password', () => {
			expect(countMetCriteria('')).toBe(0);
		});

		it('counts each satisfied criterion', () => {
			// "Abcdef1" satisfies lowercase, uppercase and digit (not length, no special) => 3
			expect(countMetCriteria('Abcdef1')).toBe(3);
		});

		it('returns 5 for a fully compliant password', () => {
			expect(countMetCriteria('Password123!')).toBe(5);
		});
	});

	describe('levelFromMet', () => {
		it('maps 0-2 to weak', () => {
			expect(levelFromMet(0)).toBe('weak');
			expect(levelFromMet(2)).toBe('weak');
		});

		it('maps 3-4 to medium', () => {
			expect(levelFromMet(3)).toBe('medium');
			expect(levelFromMet(4)).toBe('medium');
		});

		it('maps 5 to strong', () => {
			expect(levelFromMet(5)).toBe('strong');
		});
	});

	describe('computeStrength', () => {
		it('returns met 0 and weak for an empty password', () => {
			expect(computeStrength('')).toEqual({ met: 0, level: 'weak' });
		});

		it('returns weak when two criteria are met', () => {
			// "aB" => lowercase + uppercase only
			expect(computeStrength('aB')).toEqual({ met: 2, level: 'weak' });
		});

		it('returns medium when three criteria are met', () => {
			expect(computeStrength('Abcdef1')).toEqual({ met: 3, level: 'medium' });
		});

		it('returns medium when four criteria are met', () => {
			// 8+ chars, lowercase, uppercase, digit but no special => 4
			expect(computeStrength('Abcdefg1')).toEqual({ met: 4, level: 'medium' });
		});

		it('returns strong when all five criteria are met', () => {
			expect(computeStrength('Password123!')).toEqual({ met: 5, level: 'strong' });
		});
	});
});
