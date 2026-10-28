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
const InputSelectSearchableStub = {
	template: '<div data-testid="searchable-select" :id="id" />',
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
const createEmptyForm = () => ({
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	categoryId: '',
	unitId: ''
});

const mockFormState = ref({
	form: createEmptyForm(),
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

// --- Unit searchable select mock ---
const mockUnitSelected = ref({ label: '', value: '' });
const mockUnitSearchTerm = ref('');
const mockUnitLoading = ref(false);
const mockUnitOptions = ref([]);
const mockUnitLoadNextPage = vi.fn();

// --- Module mocks ---
vi.mock('~/domain/shared/translations.constants', () => ({
	languages: ['en', 'pt']
}));

vi.mock('~/components/atoms/inputSelect/InputSelect.helpers', () => ({
	mapToSelectOptions: vi.fn(() => [])
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

vi.stubGlobal('useUnitSearchableSelect', () => ({
	options: computed(() => mockUnitOptions.value),
	searchTerm: mockUnitSearchTerm,
	loading: computed(() => mockUnitLoading.value),
	selected: mockUnitSelected,
	loadNextPage: mockUnitLoadNextPage
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
	InputSelectSearchable: InputSelectSearchableStub,
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
	id: 'ing-1',
	translations: {
		en: { name: 'Sugar' },
		pt: { name: 'Açúcar' }
	},
	category: {
		id: 'cat-1',
		translations: { en: { name: 'Sweetener' }, pt: { name: 'Adoçante' } },
		isAlcoholic: false,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	unit: {
		id: 'unit-1',
		translations: {
			en: { name: 'teaspoon', namePlural: 'teaspoons' },
			pt: { name: 'colher de chá', namePlural: 'colheres de chá' }
		},
		symbol: 'tsp',
		spaceBeforeSymbol: true,
		allowDecimal: true,
		kind: 'volume',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	createdAt: new Date(),
	updatedAt: new Date()
});

describe('IngredientForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = {
			form: createEmptyForm(),
			errors: [],
			displayErrors: false
		};
		mockCategorySelected.value = { label: '', value: '' };
		mockUnitSelected.value = { label: '', value: '' };
	});

	describe('rendering', () => {
		it('renders a form with the ingredient title', () => {
			const wrapper = mountIngredientForm();
			const form = wrapper.findComponent(FormStub);

			expect(form.exists()).toBe(true);
			expect(form.props('title')).toBe('organisms.ingredientForm.title');
		});

		it('renders translation GroupWrappers per language plus the general section', () => {
			const wrapper = mountIngredientForm();
			const groups = wrapper.findAllComponents(GroupWrapperStub);

			// 2 language groups + 1 general section
			expect(groups).toHaveLength(3);
		});

		it('renders only a name text input per language', () => {
			const wrapper = mountIngredientForm();
			const inputs = wrapper.findAllComponents(InputTextStub);

			expect(inputs).toHaveLength(2);
			expect(inputs.at(0)?.props('id')).toBe('en-name');
			expect(inputs.at(1)?.props('id')).toBe('pt-name');
		});

		it('renders category and unit searchable selects', () => {
			const wrapper = mountIngredientForm();
			const selects = wrapper.findAllComponents(InputSelectSearchableStub);

			expect(selects).toHaveLength(2);
			expect(selects.at(0)?.props('id')).toBe('category');
			expect(selects.at(1)?.props('id')).toBe('unit');
		});

		it('does not render an isAlcoholic switch (it lives on the category)', () => {
			const wrapper = mountIngredientForm();

			expect(wrapper.find('[data-testid="switch"]').exists()).toBe(false);
		});
	});

	describe('initialization', () => {
		it('calls updateFormState with mapped ingredient when prop is provided', () => {
			const ingredient = createIngredientProp();
			mountIngredientForm({ ingredient });

			expect(mockUpdateFormState).toHaveBeenCalledWith({
				translations: ingredient.translations,
				categoryId: 'cat-1',
				unitId: 'unit-1'
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

		it('sets unitSelected when ingredient prop is provided', () => {
			const ingredient = createIngredientProp();
			mountIngredientForm({ ingredient });

			expect(mockUnitSelected.value).toEqual({
				value: 'unit-1',
				label: 'teaspoon'
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

		it('passes hasError from checkError to the unit select', () => {
			mockCheckError.mockReturnValue('errors.ingredients.unit');
			const wrapper = mountIngredientForm();
			const selects = wrapper.findAllComponents(InputSelectSearchableStub);

			expect(selects.at(1)?.props('hasError')).toBe(true);
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
					en: { name: 'Sugar' },
					pt: { name: 'Açúcar' }
				},
				categoryId: 'cat-1',
				unitId: 'unit-1'
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
