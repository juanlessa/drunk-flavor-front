import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import UnitForm from './UnitForm.vue';
import type { UnitFormState } from '~/types/unit.types';

const buildState = (): UnitFormState => ({
	form: {
		translations: {
			en: { name: 'milliliter', namePlural: 'milliliters' },
			pt: { name: 'mililitro', namePlural: 'mililitros' }
		},
		symbol: 'ml',
		spaceBeforeSymbol: true,
		allowDecimal: true,
		useIngredientName: false,
		kind: 'volume'
	},
	errors: [],
	displayErrors: false
});

const mockFormState = ref<UnitFormState>(buildState());
const mockValidateForm = vi.fn();
const mockErrors = ref<Record<string, string>>({});

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useUnitForm', () => ({
	formState: mockFormState,
	updateFormState: (form: UnitFormState['form']) => (mockFormState.value.form = form),
	checkError: (field: string) => mockErrors.value[field] ?? '',
	validateForm: mockValidateForm
}));

const FormStub = {
	emits: ['submit', 'cancel'],
	template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="buttons" /></form>'
};

const GenderFieldStub = {
	props: ['id', 'modelValue', 'error'],
	emits: ['update:modelValue', 'blur'],
	template: '<div :id="id" data-testid="gender" :data-value="modelValue" :data-error="error" />'
};
const mountForm = () =>
	mount(UnitForm, {
		props: { title: 'New unit', submitLabel: 'Create unit' },
		global: {
			stubs: {
				Form: FormStub,
				FormSection: {
					props: ['title', 'description'],
					template: '<section :data-title="title"><slot /></section>'
				},
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Heading: { template: '<h1><slot /></h1>' },
				Text: { template: '<p><slot /></p>' },
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				InputText: {
					props: ['modelValue', 'id', 'hasError'],
					emits: ['update:modelValue', 'blur'],
					template:
						'<input :id="id" :value="modelValue" :data-error="hasError" @input="$emit(\'update:modelValue\', $event.target.value)" />'
				},
				InputSelect: {
					props: ['modelValue', 'id'],
					template: '<div :id="id">{{ modelValue }}</div>'
				},
				GenderField: GenderFieldStub,
				InputSwitch: {
					props: ['id', 'checked'],
					emits: ['update:checked'],
					template:
						'<button type="button" role="switch" :id="id" :aria-checked="String(checked)" @click="$emit(\'update:checked\', !checked)" />'
				},
				ErrorMessage: {
					props: ['value'],
					template: '<span v-if="value" role="alert">{{ value }}</span>'
				},
				Button: {
					props: ['type'],
					template: '<button :type="type ?? \'button\'"><slot /></button>'
				},
				ArrowLeftIcon: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UnitForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = buildState();
		mockErrors.value = {};
	});

	it('renders the page header with a link back to the units list', () => {
		const wrapper = mountForm();

		expect(wrapper.find('h1').text()).toBe('New unit');
		expect(wrapper.find('a').attributes('href')).toBe('/units');
	});

	it('groups the fields in the names and format sections', () => {
		const titles = mountForm()
			.findAll('section')
			.map((section) => section.attributes('data-title'));

		expect(titles).toEqual([
			'organisms.unitForm.namesSection.title',
			'organisms.unitForm.formatSection.title'
		]);
	});

	it('previews how quantities read and follows the switches', async () => {
		const wrapper = mountForm();
		const preview = () => wrapper.find('[data-testid="unit-preview"]').text();

		expect(preview()).toContain('60 ml · 1.5 ml · 1 milliliter · 2 milliliters');

		await wrapper.find('#space-before-symbol').trigger('click');
		await wrapper.find('#allow-decimal').trigger('click');

		expect(preview()).toContain('60ml · 1 milliliter · 2 milliliters');
	});

	it('explains the preview while there is nothing to show', () => {
		mockFormState.value.form.symbol = '';
		mockFormState.value.form.translations.en = { name: '', namePlural: '' };

		expect(mountForm().find('[data-testid="unit-preview"]').text()).toContain(
			'organisms.unitForm.preview.empty'
		);
	});

	describe('written with the ingredient name', () => {
		it('starts off and writes the switch in the form, validating', async () => {
			const wrapper = mountForm();
			expect(wrapper.find('#use-ingredient-name').attributes('aria-checked')).toBe('false');
			await wrapper.find('#use-ingredient-name').trigger('click');
			expect(mockFormState.value.form.useIngredientName).toBe(true);
			expect(wrapper.find('#use-ingredient-name').attributes('aria-checked')).toBe('true');
			expect(mockValidateForm).toHaveBeenCalled();
		});
		it('labels the switch and explains it', () => {
			const text = mountForm().text();
			expect(text).toContain('organisms.unitForm.useIngredientNameInput.label');
			expect(text).toContain('organisms.unitForm.useIngredientNameInput.help');
		});
		it('explains the wording in the preview instead of writing the unit names', () => {
			mockFormState.value.form.useIngredientName = true;
			const preview = mountForm().find('[data-testid="unit-preview"]').text();
			expect(preview).toContain('organisms.unitForm.preview.ingredientName');
			expect(preview).not.toContain('1 milliliter');
		});
		it('shows the errors of the kind and of the symbol on their own fields', () => {
			mockFormState.value.form.useIngredientName = true;
			mockErrors.value = {
				kind: 'errors.units.ingredientNameKind',
				symbol: 'errors.units.ingredientNameSymbol'
			};
			const text = mountForm().text();
			expect(text).toContain('errors.units.ingredientNameKind');
			expect(text).toContain('errors.units.ingredientNameSymbol');
		});
	});
	it('describes each switch with its help text', () => {
		const wrapper = mountForm();

		for (const id of ['space-before-symbol', 'allow-decimal', 'use-ingredient-name']) {
			const describedBy = wrapper.find(`#${id}`).attributes('aria-describedby');
			expect(wrapper.find(`#${describedBy}`).exists()).toBe(true);
		}
	});

	it('emits the form on submit when it is valid', async () => {
		const wrapper = mountForm();

		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(mockValidateForm).toHaveBeenCalled();
		expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual(mockFormState.value.form);
	});

	it('does not emit while there are validation errors and shows them on the field', async () => {
		mockFormState.value.errors = [{ field: 'translations.pt.namePlural', message: 'required' }];
		mockErrors.value = { 'translations.pt.namePlural': 'errors.required' };
		const wrapper = mountForm();

		await wrapper.find('form').trigger('submit');

		expect(wrapper.emitted('submit')).toBeUndefined();
		expect(wrapper.find('#pt-name-plural').attributes('data-error')).toBe('true');
		expect(wrapper.text()).toContain('errors.required');
	});

	it('emits cancel from the cancel button', async () => {
		const wrapper = mountForm();
		const cancel = wrapper
			.findAll('button')
			.find((button) => button.text() === 'organisms.unitForm.cancelButton');

		await cancel!.trigger('click');

		expect(wrapper.emitted('cancel')).toHaveLength(1);
	});
	describe('gender', () => {
		it('asks for the gender only in the Portuguese column', () => {
			const ids = mountForm()
				.findAll('[data-testid="gender"]')
				.map((field) => field.attributes('id'));

			expect(ids).toEqual(['pt-gender']);
		});

		it('shows the gender already chosen for the Portuguese name', () => {
			mockFormState.value.form.translations.pt.gender = 'feminine';

			expect(mountForm().find('#pt-gender').attributes('data-value')).toBe('feminine');
		});

		it('writes the picked gender in the Portuguese translation only', async () => {
			const wrapper = mountForm();

			wrapper.findComponent(GenderFieldStub).vm.$emit('update:modelValue', 'masculine');
			await flushPromises();

			expect(mockFormState.value.form.translations.pt.gender).toBe('masculine');
			expect(mockFormState.value.form.translations.en).not.toHaveProperty('gender');
		});

		it('shows the error of the Portuguese gender and validates when the field loses focus', () => {
			mockErrors.value = { 'translations.pt.gender': 'errors.units.gender' };
			const wrapper = mountForm();

			expect(wrapper.find('#pt-gender').attributes('data-error')).toBe('errors.units.gender');
			wrapper.findComponent(GenderFieldStub).vm.$emit('blur');
			expect(mockValidateForm).toHaveBeenCalled();
		});
	});
});
