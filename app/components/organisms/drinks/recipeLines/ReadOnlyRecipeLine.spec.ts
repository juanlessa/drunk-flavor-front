import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ReadOnlyInput from '~/components/molecules/readOnlyInput/ReadOnlyInput.vue';
import ReadOnlyRecipeLine from './ReadOnlyRecipeLine.vue';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

const ml = {
	id: 'ml',
	symbol: 'ml',
	spaceBeforeSymbol: true,
	allowDecimal: true,
	kind: 'volume',
	translations: { en: { name: 'Milliliter' }, pt: { name: 'Mililitro' } }
};
const dash = {
	id: 'dash',
	kind: 'count',
	translations: { en: { name: 'Dash' }, pt: { name: 'Dash' } }
};
const ingredient = (units: unknown[]) => ({
	id: 'licor',
	translations: { en: { name: 'Licor 43' }, pt: { name: 'Licor 43' } },
	category: { id: 'c', translations: { en: { name: 'Liqueur' }, pt: { name: 'Licor' } } },
	units,
	kind: 'generic'
});

const mountLine = (
	line: Record<string, unknown>,
	kind: 'ingredients' | 'garnishes' = 'ingredients'
) =>
	mount(ReadOnlyRecipeLine, {
		props: { line: line as never, index: 0, kind },
		global: {
			components: { ReadOnlyInput },
			stubs: {
				ReadOnlySwitch: {
					props: ['checked'],
					template: '<span data-testid="switch" :data-checked="String(checked)" />'
				},
				Text: { template: '<p><slot /></p>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
const valueOf = (wrapper: ReturnType<typeof mountLine>, testId: string) =>
	wrapper.find(`[data-testid="${testId}"] dd`).text();

describe('ReadOnlyRecipeLine', () => {
	it('shows the position, the name and the summary, with no move or remove buttons', () => {
		const wrapper = mountLine({
			ingredient: ingredient([ml]),
			amount: { type: 'exact', quantity: 75, unit: ml },
			optional: false
		});

		expect(wrapper.text()).toContain('1. Licor 43');
		expect(wrapper.find('button').exists()).toBe(false);
	});

	it('shows an exact amount with the single unit as a suffix, as the form does', () => {
		const wrapper = mountLine({
			ingredient: ingredient([ml]),
			amount: { type: 'exact', quantity: 75, unit: ml },
			optional: false
		});

		expect(valueOf(wrapper, 'amount-type')).toBe(
			'organisms.recipeLines.amountType.options.exact'
		);
		expect(valueOf(wrapper, 'quantity')).toBe('75ml');
		expect(wrapper.find('[data-testid="unit"]').exists()).toBe(false);
	});

	it('shows the unit apart when the ingredient has more than one', () => {
		const wrapper = mountLine({
			ingredient: ingredient([ml, dash]),
			amount: { type: 'exact', quantity: 2, unit: dash },
			optional: false
		});

		expect(valueOf(wrapper, 'quantity')).toBe('2');
		expect(valueOf(wrapper, 'unit')).toBe('Dash');
	});

	it('shows the qualifier, and an empty hint when it has none', () => {
		const wrapper = mountLine({
			ingredient: ingredient([ml]),
			amount: { type: 'qualitative', qualifier: 'to_taste' },
			optional: true
		});

		expect(valueOf(wrapper, 'qualifier')).toBe(
			'organisms.recipeLines.qualifier.options.to_taste'
		);
		expect(valueOf(wrapper, 'hint')).toBe('—');
	});

	it('shows the hint of a qualitative amount', () => {
		const wrapper = mountLine({
			ingredient: ingredient([ml]),
			amount: { type: 'qualitative', qualifier: 'top_up', quantity: 120, unit: ml },
			optional: false
		});

		expect(valueOf(wrapper, 'hint')).toBe('120ml');
	});

	it('says there is no amount, as the form does', () => {
		const wrapper = mountLine({
			ingredient: ingredient([]),
			amount: { type: 'none' },
			optional: false
		});

		expect(wrapper.text()).toContain('organisms.recipeLines.amountType.noneHelp');
		expect(wrapper.find('[data-testid="quantity"]').exists()).toBe(false);
	});

	it('shows whether an ingredient is optional as a read-only yes or no', () => {
		const optional = mountLine({
			ingredient: ingredient([ml]),
			amount: { type: 'exact', quantity: 1, unit: ml },
			optional: true
		});
		const row = optional.find('[data-testid="toggle-optional"]');

		expect(row.text()).toContain('organisms.recipeLines.optional.label');
		expect(row.text()).toContain('organisms.recipeLines.optional.help');
		expect(row.find('[data-testid="switch"]').attributes('data-checked')).toBe('true');
	});

	it('has no optional row for a garnish', () => {
		const wrapper = mountLine(
			{ ingredient: ingredient([]), amount: { type: 'none' } },
			'garnishes'
		);

		expect(wrapper.find('[data-testid="toggle-optional"]').exists()).toBe(false);
	});
});
