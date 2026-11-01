import { describe, expect, it } from 'vitest';
import { getUnitSummary } from './unit.helpers';

describe('unit helpers', () => {
	it('joins the symbol and the kind', () => {
		expect(getUnitSummary({ symbol: 'ml' }, 'Volume')).toBe('ml · Volume');
	});

	it('shows only the kind when the unit has no symbol', () => {
		expect(getUnitSummary({ symbol: undefined }, 'Count')).toBe('Count');
	});
});
