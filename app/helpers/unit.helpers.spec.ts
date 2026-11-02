import { describe, expect, it } from 'vitest';
import { formatUnitQuantity, getUnitPreviewItems, getUnitSummary } from './unit.helpers';

const translations = {
	en: { name: 'leaf', namePlural: 'leaves' },
	pt: { name: 'folha', namePlural: 'folhas' }
};

describe('unit helpers', () => {
	describe('getUnitSummary', () => {
		it('joins the symbol and the kind', () => {
			expect(getUnitSummary({ symbol: 'ml' }, 'Volume')).toBe('ml · Volume');
		});

		it('shows only the kind when the unit has no symbol', () => {
			expect(getUnitSummary({ symbol: undefined }, 'Count')).toBe('Count');
		});
	});

	describe('getUnitPreviewItems', () => {
		const milliliter = {
			en: { name: 'milliliter', namePlural: 'milliliters' },
			pt: { name: 'mililitro', namePlural: 'mililitros' }
		};

		it('shows the symbol forms and both names for a unit with a symbol', () => {
			const unit = {
				symbol: 'ml',
				spaceBeforeSymbol: true,
				allowDecimal: true,
				translations: milliliter
			};

			expect(getUnitPreviewItems(unit, 'en')).toEqual([
				'60 ml',
				'1.5 ml',
				'1 milliliter',
				'2 milliliters'
			]);
		});

		it('leaves out the decimal example when decimals are not allowed', () => {
			const unit = {
				symbol: 'ml',
				spaceBeforeSymbol: false,
				allowDecimal: false,
				translations: milliliter
			};

			expect(getUnitPreviewItems(unit, 'pt')).toEqual([
				'60ml',
				'1 mililitro',
				'2 mililitros'
			]);
		});

		it('writes the names themselves when there is no symbol', () => {
			const unit = {
				symbol: '',
				spaceBeforeSymbol: false,
				allowDecimal: false,
				translations
			};

			expect(getUnitPreviewItems(unit, 'en')).toEqual(['1 leaf', '2 leaves']);
		});

		it('is empty while nothing is filled in', () => {
			const empty = { en: { name: '', namePlural: '' }, pt: { name: '', namePlural: '' } };
			const unit = {
				symbol: ' ',
				spaceBeforeSymbol: false,
				allowDecimal: true,
				translations: empty
			};

			expect(getUnitPreviewItems(unit, 'en')).toEqual([]);
		});
	});

	describe('formatUnitQuantity', () => {
		it('writes the symbol with or without a space', () => {
			expect(
				formatUnitQuantity(
					60,
					{ symbol: 'ml', spaceBeforeSymbol: true, translations },
					'en'
				)
			).toBe('60 ml');
			expect(
				formatUnitQuantity(
					60,
					{ symbol: 'ml', spaceBeforeSymbol: false, translations },
					'en'
				)
			).toBe('60ml');
		});

		it('uses the singular or plural name when there is no symbol', () => {
			expect(formatUnitQuantity(1, { symbol: '', translations }, 'en')).toBe('1 leaf');
			expect(formatUnitQuantity(2, { symbol: undefined, translations }, 'pt')).toBe(
				'2 folhas'
			);
		});

		it('formats decimals for the locale', () => {
			const unit = { symbol: 'ml', spaceBeforeSymbol: true, translations };

			expect(formatUnitQuantity(1.5, unit, 'en')).toBe('1.5 ml');
			expect(formatUnitQuantity(1.5, unit, 'pt')).toBe('1,5 ml');
		});
	});
});
