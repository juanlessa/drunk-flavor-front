import { describe, expect, it } from 'vitest';
import { getUserFullName, getUserStatusBadgeTone } from './user.helpers';

describe('user helpers', () => {
	it('joins name and surname', () => {
		expect(getUserFullName({ name: 'Bruno', surname: 'Costa' })).toBe('Bruno Costa');
	});

	it('returns an empty name for an incomplete profile', () => {
		expect(getUserFullName({ name: undefined, surname: undefined })).toBe('');
	});

	it.each([
		['active', 'success'],
		['suspended', 'warning'],
		['pending', 'neutral'],
		['incomplete_profile', 'neutral']
	] as const)('maps the %s status to the %s badge tone', (status, tone) => {
		expect(getUserStatusBadgeTone(status)).toBe(tone);
	});
});
