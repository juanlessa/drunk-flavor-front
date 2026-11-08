import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import RecipeLineItem from './RecipeLineItem.vue';
import { buildIngredient, buildLine, buildUnit, leaf, milliliter } from '~/test/drink.fixtures';
import type { DrinkRecipeLineForm } from '~/types/drink.types';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

const SelectStub = {
	props: ['id', 'modelValue', 'options', 'hasError'],
	emits: ['update:modelValue'],
	template:
		'<div :id="id" data-testid="select" :data-value="modelValue" :data-error="String(hasError)" />'
};
const NumberStub = {
	props: ['id', 'modelValue', 'suffix', 'integer', 'hasError'],
	emits: ['update:modelValue', 'blur'],
	template:
		'<input :id="id" :value="modelValue" :data-suffix="suffix" :data-integer="String(integer)" :data-error="String(hasError)" />'
};
const SwitchStub = {
	props: ['id', 'checked'],
	emits: ['update:checked'],
	template: '<button type="button" role="switch" :id="id" :aria-checked="String(checked)" />'
};

const gin = buildIngredient('gin', 'Gin');
const sugar = buildIngredient('sugar', 'Sugar', [milliliter, buildUnit('g', { symbol: 'g' })]);
const mint = buildIngredient('mint', 'Mint', [leaf]);
const foam = buildIngredient('foam', 'Foam', []);

const mountItem = (line: DrinkRecipeLineForm, props: Record<string, unknown> = {}) =>
	mount(RecipeLineItem, {
		props: { line, index: 1, total: 3, kind: 'ingredients', idPrefix: 'line', ...props },
		global: {
			stubs: {
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				Text: { template: '<p><slot /></p>' },
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				InputSelect: SelectStub,
				InputNumber: NumberStub,
				InputSwitch: SwitchStub,
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

const lastLine = (wrapper: ReturnType<typeof mountItem>) =>
	wrapper.emitted('update:line')?.at(-1)?.[0] as DrinkRecipeLineForm;
const select = (wrapper: ReturnType<typeof mountItem>, id: string) =>
	wrapper.findAllComponents(SelectStub).find((item) => item.props('id') === id)!;

describe('RecipeLineItem', () => {
	it('shows the position, the name and the category of the ingredient', () => {
		const wrapper = mountItem(buildLine(gin));

		expect(wrapper.text()).toContain('2. Gin');
		expect(wrapper.text()).toContain('Spirit · ml');
	});

	describe('exact amount', () => {
		it('shows the quantity with the unit next to it when there is only one unit', () => {
			const wrapper = mountItem(buildLine(gin));
			const input = wrapper.find('#line-quantity');

			expect(input.attributes('data-suffix')).toBe('ml');
			expect(wrapper.find('#line-unit').exists()).toBe(false);
		});

		it('only accepts whole quantities when the unit does not allow decimals', () => {
			const wrapper = mountItem(
				buildLine(mint, { type: 'exact', quantity: 8, unitId: 'leaf' })
			);

			expect(wrapper.find('#line-quantity').attributes('data-integer')).toBe('true');
		});

		it('lets the unit be chosen when the ingredient has several, starting on the first', () => {
			const wrapper = mountItem(
				buildLine(sugar, { type: 'exact', quantity: 5, unitId: 'ml' })
			);

			expect(select(wrapper, 'line-unit').props('options')).toEqual([
				{ label: 'ml', value: 'ml' },
				{ label: 'g', value: 'g' }
			]);
			expect(select(wrapper, 'line-unit').props('modelValue')).toBe('ml');
			expect(wrapper.find('#line-quantity').attributes('data-suffix')).toBe('');
		});

		it('writes the picked unit in the line', async () => {
			const wrapper = mountItem(
				buildLine(sugar, { type: 'exact', quantity: 5, unitId: 'ml' })
			);

			select(wrapper, 'line-unit').vm.$emit('update:modelValue', 'g');

			expect(lastLine(wrapper).amount).toEqual({ type: 'exact', quantity: 5, unitId: 'g' });
		});

		it('writes the typed quantity in the line', () => {
			const wrapper = mountItem(buildLine(gin));

			wrapper.findComponent(NumberStub).vm.$emit('update:modelValue', 45);

			expect(lastLine(wrapper).amount).toEqual({ type: 'exact', quantity: 45, unitId: 'ml' });
		});

		it('shows the errors of the quantity and of the unit, and validates on blur', () => {
			const wrapper = mountItem(buildLine(sugar), {
				quantityError: 'errors.drinks.quantity',
				unitError: 'errors.drinks.unit'
			});

			expect(wrapper.text()).toContain('errors.drinks.quantity');
			expect(wrapper.text()).toContain('errors.drinks.unit');
			wrapper.findComponent(NumberStub).vm.$emit('blur');
			expect(wrapper.emitted('blur')).toHaveLength(1);
		});
	});

	describe('kind of amount', () => {
		it('offers every kind of amount to an ingredient that has units', () => {
			const wrapper = mountItem(buildLine(gin));

			expect(
				select(wrapper, 'line-type')
					.props('options')
					.map((o: { value: string }) => o.value)
			).toEqual(['exact', 'qualitative', 'none']);
		});

		it('does not offer an exact amount to an ingredient with no units', () => {
			const wrapper = mountItem(buildLine(foam, { type: 'none' }));

			expect(
				select(wrapper, 'line-type')
					.props('options')
					.map((o: { value: string }) => o.value)
			).toEqual(['qualitative', 'none']);
		});

		it('turns into an exact amount in the first unit, keeping the quantity', () => {
			const wrapper = mountItem(buildLine(sugar, { type: 'none' }));

			select(wrapper, 'line-type').vm.$emit('update:modelValue', 'exact');

			expect(lastLine(wrapper).amount).toEqual({ type: 'exact', quantity: 0, unitId: 'ml' });
		});

		it('turns into a qualitative amount, starting on "to taste", and drops the quantity', () => {
			const wrapper = mountItem(buildLine(gin));

			select(wrapper, 'line-type').vm.$emit('update:modelValue', 'qualitative');

			expect(lastLine(wrapper).amount).toEqual({
				type: 'qualitative',
				qualifier: 'to_taste'
			});
		});

		it('turns into an amount with nothing to measure', () => {
			const wrapper = mountItem(buildLine(gin));

			select(wrapper, 'line-type').vm.$emit('update:modelValue', 'none');

			expect(lastLine(wrapper).amount).toEqual({ type: 'none' });
			expect(mountItem(buildLine(gin, { type: 'none' })).text()).toContain(
				'organisms.recipeLines.amountType.noneHelp'
			);
		});
	});

	describe('qualitative amount', () => {
		const qualitative = buildLine(gin, { type: 'qualitative', qualifier: 'top_up' });

		it('offers the qualifiers and writes the picked one', () => {
			const wrapper = mountItem(qualitative);

			expect(
				select(wrapper, 'line-qualifier')
					.props('options')
					.map((o: { value: string }) => o.value)
			).toEqual(['top_up', 'to_taste', 'as_needed']);
			select(wrapper, 'line-qualifier').vm.$emit('update:modelValue', 'as_needed');
			expect(lastLine(wrapper).amount).toEqual({
				type: 'qualitative',
				qualifier: 'as_needed'
			});
		});

		it('ignores a qualifier that does not exist', () => {
			const wrapper = mountItem(qualitative);

			select(wrapper, 'line-qualifier').vm.$emit('update:modelValue', 'plenty');

			expect(wrapper.emitted('update:line')).toBeUndefined();
		});

		it('lets an approximate quantity be given, in the first unit by default', () => {
			const wrapper = mountItem(qualitative);

			wrapper.find('#line-hint').element.dispatchEvent(new Event('input'));
			wrapper.findAllComponents(NumberStub)[0]!.vm.$emit('update:modelValue', 120);

			expect(lastLine(wrapper).amount).toEqual({
				type: 'qualitative',
				qualifier: 'top_up',
				quantity: 120,
				unitId: 'ml'
			});
		});

		it('has no hint for an ingredient with no units', () => {
			const wrapper = mountItem(
				buildLine(foam, { type: 'qualitative', qualifier: 'to_taste' })
			);

			expect(wrapper.find('#line-hint').exists()).toBe(false);
		});
	});

	describe('optional', () => {
		it('lets an ingredient be marked optional', () => {
			const wrapper = mountItem(buildLine(gin));

			wrapper.findComponent(SwitchStub).vm.$emit('update:checked', true);

			expect(lastLine(wrapper).optional).toBe(true);
		});

		it('describes the switch with its help', () => {
			const wrapper = mountItem(buildLine(gin));
			const describedBy = wrapper.find('#line-optional').attributes('aria-describedby');

			expect(wrapper.find(`#${describedBy}`).text()).toBe(
				'organisms.recipeLines.optional.help'
			);
		});

		it('is not offered to a garnish, which is optional by nature', () => {
			expect(
				mountItem(buildLine(gin), { kind: 'garnishes' }).find('#line-optional').exists()
			).toBe(false);
		});
	});

	describe('moves and removal', () => {
		it('cannot move the first line up or the last one down', () => {
			const first = mountItem(buildLine(gin), { index: 0 });
			const last = mountItem(buildLine(gin), { index: 2 });

			expect(
				first
					.find('button[aria-label="organisms.recipeLines.moveUp.label:Gin"]')
					.attributes('disabled')
			).toBeDefined();
			expect(
				last
					.find('button[aria-label="organisms.recipeLines.moveDown.label:Gin"]')
					.attributes('disabled')
			).toBeDefined();
		});

		it('emits the moves and the removal', async () => {
			const wrapper = mountItem(buildLine(gin));

			await wrapper
				.find('button[aria-label="organisms.recipeLines.moveUp.label:Gin"]')
				.trigger('click');
			await wrapper
				.find('button[aria-label="organisms.recipeLines.moveDown.label:Gin"]')
				.trigger('click');
			await wrapper
				.find('button[aria-label="organisms.recipeLines.removeButton.label:Gin"]')
				.trigger('click');

			expect(wrapper.emitted('moveUp')).toHaveLength(1);
			expect(wrapper.emitted('moveDown')).toHaveLength(1);
			expect(wrapper.emitted('remove')).toHaveLength(1);
		});
	});
});
