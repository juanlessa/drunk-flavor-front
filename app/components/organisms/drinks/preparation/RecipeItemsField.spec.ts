import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import RecipeItemsField from './RecipeItemsField.vue';
import { buildItemChoices } from '~/helpers/recipe.helpers';
import { buildIngredient, buildLine, leaf } from '~/test/drink.fixtures';
import type { RecipeItemRef } from '~/domain/preparation/preparation.entity';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

const SelectStub = {
	props: ['id', 'modelValue', 'options', 'placeholder', 'hasError'],
	emits: ['update:modelValue'],
	template:
		'<div :id="id" data-testid="select" :data-value="modelValue" :data-error="String(hasError)" />'
};
const SwitchStub = {
	props: ['id', 'checked'],
	emits: ['update:checked'],
	template: '<button type="button" role="switch" :id="id" :aria-checked="String(checked)" />'
};

const gin = buildIngredient('gin', 'Gin');
const mint = buildIngredient('mint', 'Mint', [leaf]);
const choices = buildItemChoices(
	{
		ingredients: [buildLine(gin)],
		garnishes: [buildLine(mint, { type: 'exact', quantity: 2, unitId: 'leaf' })]
	},
	['ingredients', 'garnishes'],
	'en'
);
const ginRef: RecipeItemRef = { list: 'ingredients', ingredientId: 'gin', unitId: 'ml' };
const mintRef: RecipeItemRef = { list: 'garnishes', ingredientId: 'mint', unitId: 'leaf' };

const mountField = (props: Record<string, unknown> = {}) =>
	mount(RecipeItemsField, {
		props: { id: 'items', label: 'Items', choices, modelValue: [], ...props },
		global: {
			stubs: {
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				InputSelect: SelectStub,
				InputSwitch: SwitchStub,
				TrashIcon: true
			},
			mocks: {
				$t: (key: string, params?: { name?: string }) =>
					params?.name ? `${key}:${params.name}` : key
			}
		}
	});

describe('RecipeItemsField, choosing one item', () => {
	it('offers the recipe lines, saying which list each comes from since there are two', () => {
		const wrapper = mountField();

		expect(wrapper.findComponent(SelectStub).props('options')).toEqual([
			{
				label: 'Gin · ml · organisms.preparationBuilder.items.lists.ingredients',
				value: 'ingredients:gin:ml'
			},
			{
				label: 'Mint · leaf · organisms.preparationBuilder.items.lists.garnishes',
				value: 'garnishes:mint:leaf'
			}
		]);
	});

	it('shows the item chosen and emits the reference of the one picked', () => {
		const wrapper = mountField({ modelValue: [ginRef] });
		expect(wrapper.findComponent(SelectStub).props('modelValue')).toBe('ingredients:gin:ml');

		wrapper.findComponent(SelectStub).vm.$emit('update:modelValue', 'garnishes:mint:leaf');

		expect(wrapper.emitted('update:modelValue')).toEqual([[[mintRef]]]);
	});

	it('shows nothing chosen for a reference that points at nothing yet', () => {
		const wrapper = mountField({ modelValue: [{ list: 'ingredients', ingredientId: '' }] });

		expect(wrapper.findComponent(SelectStub).props('modelValue')).toBe('');
	});

	it('keeps an item that left the recipe visible so it can be replaced', () => {
		const gone = { list: 'ingredients', ingredientId: 'vodka', unitId: 'ml' };
		const wrapper = mountField({ modelValue: [gone] });

		expect(wrapper.findComponent(SelectStub).props('options')[0]).toEqual({
			label: 'organisms.preparationBuilder.items.unknown',
			value: 'ingredients:vodka:ml'
		});
	});

	it('ignores a value that is not among the choices', () => {
		const wrapper = mountField();

		wrapper.findComponent(SelectStub).vm.$emit('update:modelValue', 'nope');

		expect(wrapper.emitted('update:modelValue')).toBeUndefined();
	});

	it('flags the select and shows the error', () => {
		const wrapper = mountField({ error: 'errors.drinks.preparation.item' });

		expect(wrapper.findComponent(SelectStub).props('hasError')).toBe(true);
		expect(wrapper.find('[data-testid="error"]').text()).toBe('errors.drinks.preparation.item');
	});
});

describe('RecipeItemsField, choosing several items', () => {
	it('lists the items chosen and offers only the others to add', () => {
		const wrapper = mountField({ multiple: true, modelValue: [ginRef] });

		expect(wrapper.findAll('li')).toHaveLength(1);
		expect(wrapper.text()).toContain('Gin · ml');
		expect(
			wrapper
				.findComponent(SelectStub)
				.props('options')
				.map((o: { value: string }) => o.value)
		).toEqual(['garnishes:mint:leaf']);
	});

	it('adds the item picked to the end', () => {
		const wrapper = mountField({ multiple: true, modelValue: [ginRef] });

		wrapper.findComponent(SelectStub).vm.$emit('update:modelValue', 'garnishes:mint:leaf');

		expect(wrapper.emitted('update:modelValue')).toEqual([[[ginRef, mintRef]]]);
	});

	it('removes an item', async () => {
		const wrapper = mountField({ multiple: true, modelValue: [ginRef, mintRef] });

		await wrapper
			.find(
				'button[aria-label="organisms.preparationBuilder.items.remove:Gin · ml · organisms.preparationBuilder.items.lists.ingredients"]'
			)
			.trigger('click');

		expect(wrapper.emitted('update:modelValue')).toEqual([[[mintRef]]]);
	});

	it('lets the unit be named only for an item that has one', () => {
		const withoutUnit = { list: 'ingredients' as const, ingredientId: 'gin' };
		const wrapper = mountField({ multiple: true, modelValue: [ginRef, withoutUnit] });

		expect(wrapper.findAllComponents(SwitchStub)).toHaveLength(1);
		wrapper.findComponent(SwitchStub).vm.$emit('update:checked', true);
		expect(wrapper.emitted('update:modelValue')).toEqual([
			[[{ ...ginRef, withUnit: true }, withoutUnit]]
		]);
	});

	it('flags an item that is no longer in the recipe', () => {
		const wrapper = mountField({
			multiple: true,
			modelValue: [{ list: 'ingredients', ingredientId: 'vodka', unitId: 'ml' }]
		});

		expect(wrapper.text()).toContain('organisms.preparationBuilder.items.missing');
	});
});
