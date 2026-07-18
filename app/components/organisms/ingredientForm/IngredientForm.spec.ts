import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import IngredientForm from './IngredientForm.vue';

const FormStub = {
	template:
		'<form @submit.prevent="$emit(\'submit\')">' +
		'<slot /><button type="button" @click="$emit(\'cancel\')">cancel</button></form>',
	props: ['title'],
	emits: ['submit', 'cancel']
};
const GroupWrapperStub = {
	template: '<div data-testid="group-wrapper"><slot /></div>',
	props: ['title']
};
const InputWrapperStub = {
	template:
		'<div data-testid="input-wrapper"><slot name="label" /><slot /><slot name="error" /></div>',
	props: ['direction']
};
const LabelStub = {
	template: '<label><slot /></label>',
	props: ['for']
};
const InputTextStub = {
	template: '<input :id="id" @blur="$emit(\'blur\')" />',
	props: ['id', 'modelValue', 'name', 'type', 'pattern', 'placeholder', 'hasError'],
	emits: ['update:modelValue', 'blur']
};
const InputSearchableSelectStub = {
	template: '<div data-testid="searchable-select" />',
	props: ['id', 'modelValue', 'searchTerm', 'options', 'infiniteScroll', 'loading', 'hasError'],
	emits: ['update:modelValue', 'update:searchTerm', 'load-more', 'blur']
};
const InputSwitchStub = {
	template: '<input type="checkbox" data-testid="switch" />',
	props: ['checked'],
	emits: ['update:checked']
};
const ErrorMessageStub = {
	template: '<span data-testid="error-message">{{ value }}</span>',
	props: ['value']
};

// --- Form composable mock ---
const mockFormState = ref({
	form: {
		translations: {
			en: { name: '', unit: '', unit_plural: '' },
			pt: { name: '', unit: '', unit_plural: '' }
		},
		category_id: '',
		is_alcoholic: false
	},
	errors: [] as { field: string; message: string }[],
	displayErrors: false
});
const mockCheckError = vi.fn(() => '');
const mockValidateForm = vi.fn();
const mockUpdateFormState = vi.fn();
const mockResetFormState = vi.fn();

// --- Category searchable select mock ---
const mockCategorySelected = ref({ label: '', value: '' });
const mockCategorySearchTerm = ref('');
const mockCategoryLoading = ref(false);
const mockCategoryOptions = ref([]);
const mockCategoryLoadNextPage = vi.fn();

// --- Module mocks ---
vi.mock('~/constants/translations', () => ({
	languages: ['en', 'pt']
}));

vi.mock('~/helpers/inputSelect.helpers', () => ({
	mapToSelectOptions: vi.fn(() => [])
}));

vi.mock('~/helpers/ingredientMappers', () => ({
	mapIngredientToForm: vi.fn((ingredient) => ({
		translations: ingredient.translations,
		category_id: ingredient.category._id,
		is_alcoholic: ingredient.is_alcoholic
	}))
}));

// --- Global stubs for Nuxt auto-imports ---
vi.stubGlobal('useIngredientForm', () => ({
	formState: mockFormState,
	checkError: mockCheckError,
	validateForm: mockValidateForm,
	updateFormState: mockUpdateFormState,
	resetFormState: mockResetFormState
}));

vi.stubGlobal('useCategorySearchableSelect', () => ({
	options: computed(() => mockCategoryOptions.value),
	searchTerm: mockCategorySearchTerm,
	loading: computed(() => mockCategoryLoading.value),
	selected: mockCategorySelected,
	loadNextPage: mockCategoryLoadNextPage
}));

vi.stubGlobal('useI18n', () => ({
	t: (key: string) => key,
	locale: ref('en')
}));

const globalStubs = {
	Form: FormStub,
	GroupWrapper: GroupWrapperStub,
	InputWrapper: InputWrapperStub,
	Label: LabelStub,
	InputText: InputTextStub,
	InputSearchableSelect: InputSearchableSelectStub,
	InputSwitch: InputSwitchStub,
	ErrorMessage: ErrorMessageStub
};

const mountIngredientForm = (props = {}) =>
	mount(IngredientForm, {
		props,
		global: {
			stubs: globalStubs,
			mocks: {
				$t: (key: string) => key,
				$i18n: { locale: 'en' }
			}
		}
	});

const createIngredientProp = () => ({
	_id: 'ing-1',
	translations: {
		en: { name: 'Sugar', unit: 'tsp', unit_plural: 'tsps' },
		pt: { name: 'Açúcar', unit: 'colher', unit_plural: 'colheres' }
	},
	category: {
		_id: 'cat-1',
		translations: { en: { name: 'Sweetener' }, pt: { name: 'Adoçante' } },
		created_at: new Date(),
		updated_at: new Date()
	},
	is_alcoholic: false,
	created_at: new Date(),
	updated_at: new Date()
});

describe('IngredientForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = {
			form: {
				translations: {
					en: { name: '', unit: '', unit_plural: '' },
					pt: { name: '', unit: '', unit_plural: '' }
				},
				category_id: '',
				is_alcoholic: false
			},
			errors: [],
			displayErrors: false
		};
		mockCategorySelected.value = { label: '', value: '' };
	});

	describe('rendering', () => {
		it('renders a form with the ingredient title', () => {
			const wrapper = mountIngredientForm();
			const form = wrapper.findComponent(FormStub);

			expect(form.exists()).toBe(true);
			expect(form.props('title')).toBe('organisms.ingredientForm.title');
		});

		it('renders translation GroupWrappers per language', () => {
			const wrapper = mountIngredientForm();
			const groups = wrapper.findAllComponents(GroupWrapperStub);

			// 2 language groups + 1 general section
			expect(groups).toHaveLength(3);
		});

		it('renders 3 text inputs per language (name, unit, unit_plural)', () => {
			const wrapper = mountIngredientForm();
			const inputs = wrapper.findAllComponents(InputTextStub);

			// 3 fields × 2 languages = 6
			expect(inputs).toHaveLength(6);
			expect(inputs.at(0)?.props('id')).toBe('en-name');
			expect(inputs.at(1)?.props('id')).toBe('en-unit');
			expect(inputs.at(2)?.props('id')).toBe('en-unit-plural');
			expect(inputs.at(3)?.props('id')).toBe('pt-name');
			expect(inputs.at(4)?.props('id')).toBe('pt-unit');
			expect(inputs.at(5)?.props('id')).toBe('pt-unit-plural');
		});

		it('renders a category searchable select', () => {
			const wrapper = mountIngredientForm();
			const select = wrapper.findComponent(InputSearchableSelectStub);

			expect(select.exists()).toBe(true);
		});

		it('renders an is_alcoholic switch', () => {
			const wrapper = mountIngredientForm();
			const switchInput = wrapper.find('[data-testid="switch"]');

			expect(switchInput.exists()).toBe(true);
		});
	});

	describe('initialization', () => {
		it('calls updateFormState with mapped ingredient when prop is provided', () => {
			const ingredient = createIngredientProp();
			mountIngredientForm({ ingredient });

			expect(mockUpdateFormState).toHaveBeenCalledWith({
				translations: ingredient.translations,
				category_id: 'cat-1',
				is_alcoholic: false
			});
		});

		it('sets categorySelected when ingredient prop is provided', () => {
			const ingredient = createIngredientProp();
			mountIngredientForm({ ingredient });

			expect(mockCategorySelected.value).toEqual({
				value: 'cat-1',
				label: 'Sweetener'
			});
		});

		it('does not call updateFormState when no prop is provided', () => {
			mountIngredientForm();

			expect(mockUpdateFormState).not.toHaveBeenCalled();
		});
	});

	describe('validation', () => {
		it('calls validateForm on text input blur', async () => {
			const wrapper = mountIngredientForm();
			const input = wrapper.findComponent(InputTextStub);

			await input.trigger('blur');

			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('passes hasError from checkError to InputText', () => {
			mockCheckError.mockReturnValue('errors.ingredients.name');
			const wrapper = mountIngredientForm();
			const inputs = wrapper.findAllComponents(InputTextStub);

			expect(inputs.at(0)?.props('hasError')).toBe(true);
		});

		it('renders error messages from checkError', () => {
			mockCheckError.mockReturnValue('errors.ingredients.name');
			const wrapper = mountIngredientForm();
			const errors = wrapper.findAll('[data-testid="error-message"]');

			expect(errors.at(0)?.text()).toBe('errors.ingredients.name');
		});
	});

	describe('submit', () => {
		it('emits submit with form data when validation passes', async () => {
			mockFormState.value.form = {
				translations: {
					en: { name: 'Sugar', unit: 'tsp', unit_plural: 'tsps' },
					pt: { name: 'Açúcar', unit: 'colher', unit_plural: 'colheres' }
				},
				category_id: 'cat-1',
				is_alcoholic: false
			};

			const wrapper = mountIngredientForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('submit');
			await wrapper.vm.$nextTick();

			expect(mockValidateForm).toHaveBeenCalled();
			expect(wrapper.emitted('submit')).toBeTruthy();
			expect(wrapper.emitted('submit')![0]).toEqual([mockFormState.value.form]);
		});

		it('does not emit submit when validation fails', async () => {
			mockFormState.value.errors = [{ field: 'translations.en.name', message: 'error.key' }];

			const wrapper = mountIngredientForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('submit');
			await wrapper.vm.$nextTick();

			expect(wrapper.emitted('submit')).toBeFalsy();
		});

		it('sets displayErrors to true on submit attempt', async () => {
			const wrapper = mountIngredientForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('submit');
			await wrapper.vm.$nextTick();

			expect(mockFormState.value.displayErrors).toBe(true);
		});
	});

	describe('cancel', () => {
		it('emits cancel when form cancel is triggered', async () => {
			const wrapper = mountIngredientForm();
			const form = wrapper.findComponent(FormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(wrapper.emitted('cancel')).toHaveLength(1);
		});
	});
});
