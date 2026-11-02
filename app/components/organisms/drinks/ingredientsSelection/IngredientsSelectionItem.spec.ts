import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import IngredientsSelectionItem from './IngredientsSelectionItem.vue';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';

vi.stubGlobal('useI18n', () => ({
	t: (key: string, params?: { name?: string }) => (params?.name ? `${key}:${params.name}` : key),
	locale: ref('en')
}));

// Only the fields the item reads; the rest of the entity is irrelevant here.
const buildIngredient = (unit: { symbol?: string; allowDecimal: boolean }) =>
	({
		id: 'mint',
		translations: { en: { name: 'Mint' }, pt: { name: 'Hortelã' } },
		category: { translations: { en: { name: 'Herb' }, pt: { name: 'Erva' } } },
		unit: {
			symbol: unit.symbol,
			allowDecimal: unit.allowDecimal,
			translations: {
				en: { name: 'leaf', namePlural: 'leaves' },
				pt: { name: 'folha', namePlural: 'folhas' }
			}
		}
	}) as unknown as Ingredient;

const InputNumberStub = {
	props: ['id', 'modelValue', 'suffix', 'integer', 'hasError'],
	emits: ['update:modelValue', 'blur'],
	template:
		'<input :id="id" :data-suffix="suffix" :data-integer="String(integer)" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />'
};

const mountItem = (props: Record<string, unknown> = {}) =>
	mount(IngredientsSelectionItem, {
		props: {
			ingredient: buildIngredient({ allowDecimal: false }),
			index: 1,
			total: 3,
			quantity: 8,
			...props
		},
		global: {
			stubs: {
				InputNumber: InputNumberStub,
				Label: { template: '<label><slot /></label>' },
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				GripIcon: true,
				ArrowUpIcon: true,
				ArrowDownIcon: true,
				TrashIcon: true
			},
			mocks: {
				$t: (key: string, params?: { name?: string }) =>
					params?.name ? `${key}:${params.name}` : key
			}
		}
	});

const button = (wrapper: ReturnType<typeof mountItem>, label: string) =>
	wrapper.find(`button[aria-label="organisms.ingredientsSelection.${label}.label:Mint"]`);

describe('IngredientsSelectionItem', () => {
	it('shows the position, the name and the category · unit summary', () => {
		const wrapper = mountItem();

		expect(wrapper.text()).toContain('2. Mint');
		expect(wrapper.text()).toContain('Herb · leaf');
	});

	it('writes the unit as the quantity suffix, with the plural name when there is no symbol', async () => {
		const wrapper = mountItem();

		expect(wrapper.find('input').attributes('data-suffix')).toBe('leaves');

		await wrapper.setProps({ quantity: 1 });
		expect(wrapper.find('input').attributes('data-suffix')).toBe('leaf');

		await wrapper.setProps({
			ingredient: buildIngredient({ symbol: 'ml', allowDecimal: true })
		});
		expect(wrapper.find('input').attributes('data-suffix')).toBe('ml');
	});

	it('only accepts whole quantities when the unit does not allow decimals', async () => {
		const wrapper = mountItem();

		expect(wrapper.find('input').attributes('data-integer')).toBe('true');

		await wrapper.setProps({
			ingredient: buildIngredient({ symbol: 'ml', allowDecimal: true })
		});
		expect(wrapper.find('input').attributes('data-integer')).toBe('false');
	});

	it('disables moving past the ends of the list', async () => {
		const first = mountItem({ index: 0 });
		const last = mountItem({ index: 2 });

		expect(button(first, 'moveUp').attributes('disabled')).toBeDefined();
		expect(button(first, 'moveDown').attributes('disabled')).toBeUndefined();
		expect(button(last, 'moveDown').attributes('disabled')).toBeDefined();
	});

	it('emits the quantity, the moves and the removal', async () => {
		const wrapper = mountItem();

		await wrapper.find('input').setValue('10');
		await button(wrapper, 'moveUp').trigger('click');
		await button(wrapper, 'moveDown').trigger('click');
		await wrapper
			.findAll(
				'button[aria-label="organisms.ingredientsSelection.removeButton.label:Mint"]'
			)[0]!
			.trigger('click');

		expect(wrapper.emitted('update:quantity')).toEqual([[10]]);
		expect(wrapper.emitted('moveUp')).toHaveLength(1);
		expect(wrapper.emitted('moveDown')).toHaveLength(1);
		expect(wrapper.emitted('remove')).toHaveLength(1);
	});

	it('marks the drag handle and links it to the reorder instructions', () => {
		const handle = mountItem({ instructionsId: 'reorder-help' }).find('[data-drag-handle]');

		expect(handle.attributes('aria-label')).toBe(
			'organisms.ingredientsSelection.dragHandle.label:Mint'
		);
		expect(handle.attributes('aria-describedby')).toBe('reorder-help');
		expect(handle.classes()).toContain('touch-none');
	});

	it('shows the quantity error', () => {
		expect(
			mountItem({ error: 'errors.drinks.quantity' }).find('[data-testid="error"]').text()
		).toBe('errors.drinks.quantity');
	});
});
