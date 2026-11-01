import { describe, expect, it } from 'vitest';
import { tv } from './tv';

describe('tv', () => {
	it('keeps a design-system font size and a text colour side by side', () => {
		const style = tv({ base: 'text-body text-content' });

		expect(style()).toBe('text-body text-content');
	});

	it('lets a design-system radius override the base radius', () => {
		const style = tv({ base: 'rounded-none h-6' });

		expect(style({ class: 'rounded-control' })).toBe('h-6 rounded-control');
		expect(style({ class: 'rounded-control-card' })).toBe('h-6 rounded-control-card');
	});

	it('still merges built-in radius classes', () => {
		const style = tv({ base: 'rounded-none' });

		expect(style({ class: 'rounded-xs' })).toBe('rounded-xs');
	});
});
