import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import CategoryForm from './CategoryForm.vue';

const FormStub = {
	template: '<form @submit.prevent="$emit(\'submit\')">'
		+ '<slot /><button type="button" @click="$emit(\'cancel\')">cancel</button></form>',
	props: ['title'],
	emits: ['submit', 'cancel']
};
const GroupWrapperStub = {
	template: '<div data-testid="group-wrapper"><slot /></div>',
	props: ['title']
};
const InputWrapperStub = {
	template:
		'<div data-testid="input-wrapper"><slot name="label" /><slot /><slot name="error" /></div>'
};
const LabelStub = {
	template: '<label><slot /></label>',
	props: ['for']
};
const InputTextStub = {
	template:
		'<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />',
	props: ['id', 'modelValue', 'name', 'type', 'pattern', 'placeholder', 'hasError'],
	emits: ['update:modelValue', 'blur']
};
const ErrorMessageStub = {
	template: '<span data-testid="error-message">{{ value }}</span>',
	props: ['value']
};

const mockFormState = ref({
	form: {
		translations: {
			en: { name: '' },
			pt: { name: '' }
		}
	},
	errors: [] as { field: string; message: string }[],
	displayErrors: false
});

const mockCheckError = vi.fn(() => '');
const mockValidateForm = vi.fn();
const mockUpdateFormState = vi.fn();
const mockResetFormState = vi.fn();

vi.mock('~/constants/translations', () => ({
	languages: ['en', 'pt']
}));

vi.stubGlobal('useCategoryForm', () => ({
	formState: mockFormState,
	checkError: mockCheckError,
	validateForm: mockValidateForm,
	updateFormState: mockUpdateFormState,
	resetFormState: mockResetFormState
}));

const globalStubs = {
	Form: FormStub,
	GroupWrapper: GroupWrapperStub,
	InputWrapper: InputWrapperStub,
	Label: LabelStub,
	InputText: InputTextStub,
	ErrorMessage: ErrorMessageStub
};

const mountCategoryForm = (props = {}) =>
	mount(CategoryForm, {
		props,
		global: {
			stubs: globalStubs,
			mocks: {
				$t: (key: string) => key,
				$i18n: { locale: 'en' }
			}
		}
	});

describe('CategoryForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = {
			form: {
				translations: {
					en: { name: '' },
					pt: { name: '' }
				}
			},
			errors: [],
			displayErrors: false
		};
	});

	describe('rendering', () => {
		it('renders a form with the category title', () => {
			const wrapper = mountCategoryForm();
			const form = wrapper.findComponent(FormStub);

			expect(form.exists()).toBe(true);
			expect(form.props('title')).toBe('organisms.categoryForm.title');
		});

		it('renders one GroupWrapper per language', () => {
			const wrapper = mountCategoryForm();
			const groups = wrapper.findAllComponents(GroupWrapperStub);

			expect(groups).toHaveLength(2);
		});

		it('renders a name input for each language', () => {
			const wrapper = mountCategoryForm();
			const inputs = wrapper.findAllComponents(InputTextStub);

			expect(inputs).toHaveLength(2);
			expect(inputs.at(0)?.props('id')).toBe('en-name');
			expect(inputs.at(1)?.props('id')).toBe('pt-name');
		});
	});

	describe('initialization', () => {
		it('calls updateFormState when categoryForm prop is provided', () => {
			const categoryForm = {
				translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } }
			};

			mountCategoryForm({ categoryForm });

			expect(mockUpdateFormState).toHaveBeenCalledWith(categoryForm);
		});

		it('does not call updateFormState when no prop is provided', () => {
			mountCategoryForm();

			expect(mockUpdateFormState).not.toHaveBeenCalled();
		});
	});

	describe('validation', () => {
		it('calls validateForm on input blur', async () => {
			const wrapper = mountCategoryForm();
			const input = wrapper.findComponent(InputTextStub);

			await input.trigger('blur');

			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('passes hasError from checkError to InputText', () => {
			mockCheckError.mockReturnValue('errors.categories.name');
			const wrapper = mountCategoryForm();
			const inputs = wrapper.findAllComponents(InputTextStub);

			expect(inputs.at(0)?.props('hasError')).toBe(true);
		});

		it('renders error message from checkError', () => {
			mockCheckError.mockReturnValue('errors.categories.name');
			const wrapper = mountCategoryForm();
			const errors = wrapper.findAll('[data-testid="error-message"]');

			expect(errors.at(0)?.text()).toBe('errors.categories.name');
		});
	});

	describe('submit', () => {
		it('emits submit with form data when validation passes', async () => {
			mockFormState.value.form.translations.en.name = 'Juice';
			mockFormState.value.form.translations.pt.name = 'Suco';

			const wrapper = mountCategoryForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('submit');
			await wrapper.vm.$nextTick();

			expect(mockValidateForm).toHaveBeenCalled();
			expect(wrapper.emitted('submit')).toBeTruthy();
			expect(wrapper.emitted('submit')![0]).toEqual([
				{ translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } } }
			]);
		});

		it('does not emit submit when validation fails', async () => {
			mockFormState.value.errors = [{ field: 'translations.en.name', message: 'error.key' }];

			const wrapper = mountCategoryForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('submit');
			await wrapper.vm.$nextTick();

			expect(wrapper.emitted('submit')).toBeFalsy();
		});

		it('sets displayErrors to true on submit attempt', async () => {
			const wrapper = mountCategoryForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('submit');
			await wrapper.vm.$nextTick();

			expect(mockFormState.value.displayErrors).toBe(true);
		});
	});

	describe('cancel', () => {
		it('emits cancel when form cancel is triggered', async () => {
			const wrapper = mountCategoryForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(wrapper.emitted('cancel')).toHaveLength(1);
		});
	});
});
