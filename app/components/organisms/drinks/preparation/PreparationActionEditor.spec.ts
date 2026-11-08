import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import PreparationActionEditor from './PreparationActionEditor.vue';
import RecipeItemsField from './RecipeItemsField.vue';
import RoleField from './RoleField.vue';
import type { PreparationAction, RecipeList } from '~/domain/preparation/preparation.entity';
import { buildItemChoices } from '~/helpers/recipe.helpers';
import { buildIngredient, buildLine } from '~/test/drink.fixtures';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

const SelectStub = {
	props: ['id', 'modelValue', 'options', 'placeholder'],
	emits: ['update:modelValue'],
	template: '<div :id="id" data-testid="select" :data-value="modelValue" />'
};
const NumberStub = {
	props: { id: String, modelValue: Number, hasError: Boolean, integer: Boolean, suffix: String },
	emits: ['update:modelValue'],
	template: '<input :id="id" :value="modelValue" :data-error="String(hasError)" />'
};
const SwitchStub = {
	props: ['id', 'checked'],
	emits: ['update:checked'],
	template: '<button type="button" role="switch" :id="id" :aria-checked="String(checked)" />'
};
const TextAreaStub = {
	props: ['id', 'modelValue', 'hasError'],
	emits: ['update:modelValue'],
	template: '<textarea :id="id" :value="modelValue" :data-error="String(hasError)" />'
};

const gin = buildIngredient('gin', 'Gin');
const salt = buildIngredient('salt', 'Salt', []);
const choices: Record<RecipeList, ReturnType<typeof buildItemChoices>> = {
	ingredients: buildItemChoices({ ingredients: [buildLine(gin)] }, ['ingredients'], 'en'),
	garnishes: buildItemChoices(
		{ garnishes: [buildLine(salt, { type: 'none' })] },
		['garnishes'],
		'en'
	)
};
const ginRef = { list: 'ingredients' as const, ingredientId: 'gin', unitId: 'ml' };
const saltRef = { list: 'garnishes' as const, ingredientId: 'salt' };

const mountEditor = (action: PreparationAction, errorOf: (field: string) => string = () => '') =>
	mount(PreparationActionEditor, {
		props: { action, choices, idPrefix: 'a', errorOf },
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
				InputTextArea: TextAreaStub
			},
			mocks: { $t: (key: string) => key }
		}
	});
const last = (wrapper: ReturnType<typeof mountEditor>) =>
	wrapper.emitted('update:action')?.at(-1)?.[0] as PreparationAction;
const select = (wrapper: ReturnType<typeof mountEditor>, id: string) =>
	wrapper.findAllComponents(SelectStub).find((item) => item.props('id') === id)!;
const optionValues = (wrapper: ReturnType<typeof mountEditor>, id: string) =>
	select(wrapper, id)
		.props('options')
		.map((option: { value: string }) => option.value);

describe('PreparationActionEditor', () => {
	describe('prepare_glass', () => {
		it('offers the four things that can be done to the glass', () => {
			const wrapper = mountEditor({ type: 'prepare_glass', mode: 'chill' });

			expect(optionValues(wrapper, 'a-mode')).toEqual(['chill', 'warm', 'rinse', 'rim']);
			expect(wrapper.findComponent(RecipeItemsField).exists()).toBe(false);
		});

		it('asks for the liquid to rinse with, taken from the ingredients, and starts with no item', () => {
			const wrapper = mountEditor({ type: 'prepare_glass', mode: 'chill' });

			select(wrapper, 'a-mode').vm.$emit('update:modelValue', 'rinse');

			expect(last(wrapper)).toEqual({
				type: 'prepare_glass',
				mode: 'rinse',
				item: { list: 'ingredients', ingredientId: '' }
			});
		});

		it('asks for what to rim with, starting from the garnishes', () => {
			const wrapper = mountEditor({ type: 'prepare_glass', mode: 'chill' });

			select(wrapper, 'a-mode').vm.$emit('update:modelValue', 'rim');

			expect(last(wrapper)).toMatchObject({
				mode: 'rim',
				item: { list: 'garnishes', ingredientId: '' }
			});
		});

		it('drops the item when the glass is only chilled or warmed', () => {
			const wrapper = mountEditor({ type: 'prepare_glass', mode: 'rinse', item: ginRef });

			select(wrapper, 'a-mode').vm.$emit('update:modelValue', 'warm');

			expect(last(wrapper)).toEqual({ type: 'prepare_glass', mode: 'warm' });
		});

		it('keeps the item when the glass goes from rinsed to rimmed', () => {
			const wrapper = mountEditor({ type: 'prepare_glass', mode: 'rinse', item: ginRef });

			select(wrapper, 'a-mode').vm.$emit('update:modelValue', 'rim');

			expect(last(wrapper)).toMatchObject({ mode: 'rim', item: ginRef });
		});

		it('rinses with an ingredient and rims with a garnish or an ingredient', () => {
			const rinse = mountEditor({ type: 'prepare_glass', mode: 'rinse', item: ginRef });
			const rim = mountEditor({
				type: 'prepare_glass',
				mode: 'rim',
				item: saltRef,
				coverage: 'half'
			});

			expect(
				rinse
					.findComponent(RecipeItemsField)
					.props('choices')
					?.map((c: { list: string }) => c.list)
			).toEqual(['ingredients']);
			expect(
				rim
					.findComponent(RecipeItemsField)
					.props('choices')
					?.map((c: { list: string }) => c.list)
			).toEqual(['garnishes', 'ingredients']);
		});

		it('writes the picked item and the coverage of the rim', () => {
			const wrapper = mountEditor({ type: 'prepare_glass', mode: 'rim', item: saltRef });

			wrapper.findComponent(RecipeItemsField).vm.$emit('update:modelValue', [saltRef]);
			expect(last(wrapper)).toMatchObject({ item: saltRef });
			expect(select(wrapper, 'a-coverage').props('modelValue')).toBe('full');
			select(wrapper, 'a-coverage').vm.$emit('update:modelValue', 'half');
			expect(last(wrapper)).toMatchObject({ coverage: 'half' });
		});

		it('shows the error of the item', () => {
			const wrapper = mountEditor(
				{
					type: 'prepare_glass',
					mode: 'rinse',
					item: { list: 'ingredients', ingredientId: '' }
				},
				(field) => (field === 'item' ? 'errors.drinks.preparation.item' : '')
			);

			expect(wrapper.findComponent(RecipeItemsField).props('error')).toBe(
				'errors.drinks.preparation.item'
			);
		});
	});

	describe('add', () => {
		it('picks the ingredients and the vessel they go into', () => {
			const wrapper = mountEditor({ type: 'add', target: 'mixing', items: [] });

			expect(wrapper.findComponent(RecipeItemsField).props('multiple')).toBe(true);
			expect(wrapper.findComponent(RecipeItemsField).props('choices')).toEqual(
				choices.ingredients
			);
			wrapper.findComponent(RecipeItemsField).vm.$emit('update:modelValue', [ginRef]);
			expect(last(wrapper)).toEqual({ type: 'add', target: 'mixing', items: [ginRef] });
			wrapper.findComponent(RoleField).vm.$emit('update:modelValue', 'serving');
			expect(last(wrapper)).toMatchObject({ target: 'serving' });
		});
	});

	describe('add_ice', () => {
		it('picks the kind of ice and where it goes', () => {
			const wrapper = mountEditor({ type: 'add_ice', target: 'mixing', kind: 'cubes' });

			expect(optionValues(wrapper, 'a-ice')).toEqual([
				'cubes',
				'crushed',
				'large_cube',
				'sphere'
			]);
			select(wrapper, 'a-ice').vm.$emit('update:modelValue', 'sphere');
			expect(last(wrapper)).toEqual({ type: 'add_ice', target: 'mixing', kind: 'sphere' });
		});
	});

	describe('muddle, shake and stir', () => {
		it('picks the intensity, left on its default until chosen', () => {
			const wrapper = mountEditor({ type: 'muddle' });

			expect(select(wrapper, 'a-intensity').props('modelValue')).toBe('');
			select(wrapper, 'a-intensity').vm.$emit('update:modelValue', 'gentle');
			expect(last(wrapper)).toEqual({ type: 'muddle', intensity: 'gentle' });
		});

		it('writes the seconds of a shake as a whole number, and none for zero', () => {
			const wrapper = mountEditor({ type: 'shake', seconds: 10 });
			const seconds = wrapper.findAllComponents(NumberStub)[0]!;

			expect(seconds.props('integer')).toBe(true);
			expect(seconds.props('modelValue')).toBe(10);
			seconds.vm.$emit('update:modelValue', 15);
			expect(last(wrapper)).toMatchObject({ seconds: 15 });
			seconds.vm.$emit('update:modelValue', 0);
			expect((last(wrapper) as { seconds?: number }).seconds).toBeUndefined();
		});

		it('writes the seconds or the turns of a stir', () => {
			const wrapper = mountEditor({ type: 'stir' });
			const [seconds, revolutions] = wrapper.findAllComponents(NumberStub);

			seconds!.vm.$emit('update:modelValue', 20);
			expect(last(wrapper)).toMatchObject({ seconds: 20 });
			revolutions!.vm.$emit('update:modelValue', 30);
			expect(last(wrapper)).toMatchObject({ revolutions: 30 });
		});

		it('shows the error of a duration', () => {
			const wrapper = mountEditor({ type: 'shake', seconds: 1.5 }, (field) =>
				field === 'seconds' ? 'errors.drinks.preparation.duration' : ''
			);

			expect(wrapper.findComponent(NumberStub).props('hasError')).toBe(true);
			expect(wrapper.find('[data-testid="error"]').text()).toBe(
				'errors.drinks.preparation.duration'
			);
		});
	});

	describe('strain', () => {
		it('picks the strainer and strains into the serving glass by default', () => {
			const wrapper = mountEditor({ type: 'strain', kind: 'single' });

			expect(optionValues(wrapper, 'a-strain')).toEqual(['single', 'double', 'fine', 'none']);
			expect(select(wrapper, 'a-to').props('modelValue')).toBe('serving');
			select(wrapper, 'a-strain').vm.$emit('update:modelValue', 'double');
			expect(last(wrapper)).toEqual({ type: 'strain', kind: 'double' });
		});

		it('can pour onto the ice already in the glass', () => {
			const wrapper = mountEditor({ type: 'strain', kind: 'single' });

			wrapper.findComponent(SwitchStub).vm.$emit('update:checked', true);

			expect(last(wrapper)).toEqual({ type: 'strain', kind: 'single', overIce: true });
		});

		it('strains back into the mixing vessel, where "over the ice" makes no sense', () => {
			const wrapper = mountEditor({ type: 'strain', kind: 'single', overIce: true });

			select(wrapper, 'a-to').vm.$emit('update:modelValue', 'mixing');

			const result = last(wrapper);
			expect(result).toMatchObject({ type: 'strain', to: 'mixing' });
			expect(result.type === 'strain' && result.overIce).toBeUndefined();
			expect(
				mountEditor({ type: 'strain', kind: 'single', to: 'mixing' })
					.findComponent(SwitchStub)
					.exists()
			).toBe(false);
		});

		it('goes back to the serving glass by sending no destination', () => {
			const wrapper = mountEditor({ type: 'strain', kind: 'single', to: 'mixing' });

			select(wrapper, 'a-to').vm.$emit('update:modelValue', 'serving');

			const result = last(wrapper);
			expect(result.type === 'strain' && result.to).toBeUndefined();
		});
	});

	describe('top and garnish', () => {
		it('tops with an ingredient', () => {
			const wrapper = mountEditor({
				type: 'top',
				item: { list: 'ingredients', ingredientId: '' }
			});

			wrapper.findComponent(RecipeItemsField).vm.$emit('update:modelValue', [ginRef]);

			expect(last(wrapper)).toEqual({ type: 'top', item: ginRef });
			expect(wrapper.findComponent(RecipeItemsField).props('modelValue')).toEqual([]);
		});

		it('garnishes with the garnishes, in a style', () => {
			const wrapper = mountEditor({ type: 'garnish', items: [] });

			expect(wrapper.findComponent(RecipeItemsField).props('choices')).toEqual(
				choices.garnishes
			);
			wrapper.findComponent(RecipeItemsField).vm.$emit('update:modelValue', [saltRef]);
			expect(last(wrapper)).toEqual({ type: 'garnish', items: [saltRef] });
			select(wrapper, 'a-style').vm.$emit('update:modelValue', 'float');
			expect(last(wrapper)).toMatchObject({ style: 'float' });
			expect(optionValues(wrapper, 'a-style')).toHaveLength(8);
		});
	});

	describe('custom', () => {
		it('writes the text of each language', () => {
			const wrapper = mountEditor({ type: 'custom', text: { en: 'Stir.', pt: '' } });
			const [en, pt] = wrapper.findAllComponents(TextAreaStub);

			pt!.vm.$emit('update:modelValue', 'Mexa.');
			expect(last(wrapper)).toMatchObject({ text: { en: 'Stir.', pt: 'Mexa.' } });
			en!.vm.$emit('update:modelValue', 'Stir gently.');
			expect(last(wrapper)).toMatchObject({ text: { en: 'Stir gently.', pt: '' } });
		});

		it('flags only the text that is missing when there is an error', () => {
			const wrapper = mountEditor(
				{ type: 'custom', text: { en: 'Stir.', pt: ' ' } },
				(field) => (field === 'text' ? 'errors.drinks.preparation.text' : '')
			);
			const [en, pt] = wrapper.findAllComponents(TextAreaStub);

			expect(en!.props('hasError')).toBe(false);
			expect(pt!.props('hasError')).toBe(true);
			expect(wrapper.text()).toContain('errors.drinks.preparation.text');
		});

		it('can declare the items it uses, and then says where they end up', () => {
			const wrapper = mountEditor({ type: 'custom', text: { en: 'a', pt: 'b' } });
			expect(wrapper.findComponent(RoleField).exists()).toBe(false);

			wrapper
				.findComponent(RecipeItemsField)
				.vm.$emit('update:modelValue', [ginRef, saltRef]);
			expect(last(wrapper)).toMatchObject({ items: [ginRef, saltRef] });

			const withItems = mountEditor({
				type: 'custom',
				text: { en: 'a', pt: 'b' },
				items: [ginRef]
			});
			expect(withItems.findComponent(RoleField).exists()).toBe(true);
			withItems.findComponent(RoleField).vm.$emit('update:modelValue', 'mixing');
			expect(last(withItems)).toMatchObject({ into: 'mixing' });
		});

		it('offers the ingredients and the garnishes', () => {
			const wrapper = mountEditor({ type: 'custom', text: { en: 'a', pt: 'b' } });

			expect(
				wrapper
					.findComponent(RecipeItemsField)
					.props('choices')
					?.map((c: { list: string }) => c.list)
			).toEqual(['ingredients', 'garnishes']);
		});
	});
});
