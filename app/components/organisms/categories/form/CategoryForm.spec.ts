import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import CategoryForm from './CategoryForm.vue';
import type { CategoryFormState } from '~/types/category.types';

const buildState = (): CategoryFormState => ({
	form: {
		translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } },
		isAlcoholic: false
	},
	errors: [],
	displayErrors: false
});

const mockFormState = ref<CategoryFormState>(buildState());
const mockCheckError = vi.fn((_field: string) => '');
const mockValidateForm = vi.fn();
const mockUpdateFormState = vi.fn();

vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useCategoryForm', () => ({
	formState: mockFormState,
	checkError: mockCheckError,
	validateForm: mockValidateForm,
	updateFormState: mockUpdateFormState,
	resetFormState: vi.fn()
}));

const FormStub = {
	emits: ['submit', 'cancel'],
	template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="buttons" /></form>'
};
const InputTextStub = {
	props: ['id', 'modelValue', 'hasError'],
	emits: ['update:modelValue', 'blur'],
	template:
		'<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />'
};

const mountForm = (props = {}) =>
	mount(CategoryForm, {
		props: { title: 'New category', submitLabel: 'Create category', ...props },
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
				InputText: InputTextStub,
				InputSwitch: {
					props: ['id', 'checked'],
					emits: ['update:checked'],
					template:
						'<button type="button" role="switch" :id="id" :aria-checked="String(checked)" @click="$emit(\'update:checked\', !checked)" />'
				},
				ErrorMessage: {
					props: ['value'],
					template: '<span v-if="value" data-testid="error-message">{{ value }}</span>'
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

describe('CategoryForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCheckError.mockReturnValue('');
		mockFormState.value = buildState();
	});

	describe('rendering', () => {
		it('renders the page header with a link back to the categories list', () => {
			const wrapper = mountForm();

			expect(wrapper.find('h1').text()).toBe('New category');
			expect(wrapper.find('a').attributes('href')).toBe('/categories');
		});

		it('groups the fields in the names and classification sections', () => {
			const titles = mountForm()
				.findAll('section')
				.map((section) => section.attributes('data-title'));

			expect(titles).toEqual([
				'organisms.categoryForm.namesSection.title',
				'organisms.categoryForm.classificationSection.title'
			]);
		});

		it('renders a name input for each language', () => {
			const inputs = mountForm().findAllComponents(InputTextStub);

			expect(inputs.map((input) => input.props('id'))).toEqual(['en-name', 'pt-name']);
		});

		it('describes the alcoholic switch with its help text', () => {
			const wrapper = mountForm();
			const describedBy = wrapper.find('#is-alcoholic').attributes('aria-describedby');

			expect(wrapper.find(`#${describedBy}`).text()).toBe(
				'organisms.categoryForm.isAlcoholicInput.help'
			);
		});

		it('labels the submit button with the given text', () => {
			expect(mountForm().find('button[type="submit"]').text()).toBe('Create category');
		});
	});

	describe('initialization', () => {
		it('loads the given category into the form state', () => {
			const categoryForm = buildState().form;

			mountForm({ categoryForm });

			expect(mockUpdateFormState).toHaveBeenCalledWith(categoryForm);
		});

		it('keeps the current state when no category is given', () => {
			mountForm();

			expect(mockUpdateFormState).not.toHaveBeenCalled();
		});
	});

	describe('validation', () => {
		it('validates on input blur', async () => {
			await mountForm().findComponent(InputTextStub).trigger('blur');

			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('flags the field and shows the message from checkError', () => {
			mockCheckError.mockImplementation((field: string) =>
				field === 'translations.pt.name' ? 'errors.categories.name' : ''
			);
			const wrapper = mountForm();
			const inputs = wrapper.findAllComponents(InputTextStub);

			expect(inputs.at(0)?.props('hasError')).toBe(false);
			expect(inputs.at(1)?.props('hasError')).toBe(true);
			expect(wrapper.find('[data-testid="error-message"]').text()).toBe(
				'errors.categories.name'
			);
		});
	});

	describe('submit', () => {
		it('emits the form when validation passes', async () => {
			const wrapper = mountForm();

			await wrapper.find('form').trigger('submit');

			expect(mockFormState.value.displayErrors).toBe(true);
			expect(mockValidateForm).toHaveBeenCalled();
			expect(wrapper.emitted('submit')?.[0]).toEqual([mockFormState.value.form]);
		});

		it('includes the alcoholic flag toggled by the switch', async () => {
			const wrapper = mountForm();

			await wrapper.find('#is-alcoholic').trigger('click');
			await wrapper.find('form').trigger('submit');

			expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({ isAlcoholic: true });
		});

		it('does not emit while there are validation errors', async () => {
			mockFormState.value.errors = [{ field: 'translations.en.name', message: 'error.key' }];
			const wrapper = mountForm();

			await wrapper.find('form').trigger('submit');

			expect(wrapper.emitted('submit')).toBeUndefined();
		});
	});

	describe('cancel', () => {
		it('emits cancel from the cancel button', async () => {
			const wrapper = mountForm();
			const cancel = wrapper
				.findAll('button')
				.find((button) => button.text() === 'organisms.categoryForm.cancelButton');

			await cancel!.trigger('click');

			expect(wrapper.emitted('cancel')).toHaveLength(1);
		});
	});
});
