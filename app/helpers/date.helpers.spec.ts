import { describe, expect, it } from 'vitest';
import { formatDateTime, formatRelativeTime } from './date.helpers';

const now = new Date('2026-10-27T12:00:00.000Z');
const ago = (seconds: number) => new Date(now.getTime() - seconds * 1000);

describe('formatRelativeTime', () => {
	it('reads as "now" within a minute either way', () => {
		expect(formatRelativeTime(ago(30), 'en', now)).toBe('now');
		expect(formatRelativeTime(ago(-30), 'en', now)).toBe('now');
	});

	it('formats future dates', () => {
		expect(formatRelativeTime(ago(-18 * 60 * 60), 'en', now)).toBe('in 18 hours');
		expect(formatRelativeTime(ago(-18 * 60 * 60), 'pt', now)).toBe('em 18 horas');
	});

	it('uses the largest whole unit', () => {
		expect(formatRelativeTime(ago(5 * 60), 'en', now)).toBe('5 minutes ago');
		expect(formatRelativeTime(ago(3 * 60 * 60), 'en', now)).toBe('3 hours ago');
		expect(formatRelativeTime(ago(24 * 60 * 60), 'en', now)).toBe('yesterday');
		expect(formatRelativeTime(ago(15 * 24 * 60 * 60), 'en', now)).toBe('2 weeks ago');
		expect(formatRelativeTime(ago(400 * 24 * 60 * 60), 'en', now)).toBe('last year');
	});

	it('formats in Brazilian Portuguese for the pt locale', () => {
		expect(formatRelativeTime(ago(2 * 60 * 60), 'pt', now)).toBe('há 2 horas');
		expect(formatRelativeTime(now.toISOString(), 'pt', now)).toBe('agora');
	});
});

describe('formatDateTime', () => {
	it('formats the full date in the given locale', () => {
		expect(formatDateTime(now, 'en')).toContain('2026');
		expect(formatDateTime(now, 'pt')).toContain('de outubro de 2026');
	});
});
