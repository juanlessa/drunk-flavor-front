import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import IngredientForm from './IngredientForm.vue';
import type { IngredientForm as IngredientFormValues } from '~/types/ingredient.types';

const FormStub = {
	template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="buttons" /></form>',
	emits: ['submit', 'cancel']
};
const FormSectionStub = {
	template: '<section :data-title="title"><slot /></section>',
	props: ['title', 'description']
};
const InputWrapperStub = {
	template: '<div><slot name="label" /><slot /><slot name="error" /></div>',
	props: ['direction']
};
const InputTextStub = {
	template:
		'<input :id="id" :disabled="disabled" :data-error="hasError" @blur="$emit(\'blur\')" />',
	props: ['id', 'modelValue', 'name', 'type', 'placeholder', 'hasError', 'disabled'],
	emits: ['update:modelValue', 'blur']
};
const InputSelectSearchableStub = {
	template: '<div data-testid="searchable-select" :id="id" />',
	props: ['id', 'modelValue', 'searchTerm', 'options', 'infiniteScroll', 'loading', 'hasError'],
	emits: ['update:modelValue', 'update:searchTerm', 'load-more', 'blur']
};
const InputSwitchStub = {
	template:
		'<button type="button" role="switch" :id="id" :aria-checked="String(checked)" @click="$emit(\'update:checked\', !checked)" />',
	props: ['id', 'checked'],
	emits: ['update:checked']
};
const ErrorMessageStub = {
	template: '<span data-testid="error-message">{{ value }}</span>',
	props: ['value']
};
const GenderFieldStub = {
	template: '<div :id="id" data-testid="gender" />',
	props: ['id', 'modelValue', 'error'],
	emits: ['update:modelValue', 'blur']
};
const RadioCardGroupStub = {
	template: '<div data-testid="kind" :data-value="modelValue" />',
	props: ['id', 'modelValue', 'options', 'label', 'name'],
	emits: ['update:modelValue']
};
const UnitsSelectionStub = {
	template: '<div data-testid="units" />',
	props: ['units', 'error'],
	emits: ['update:units', 'blur']
};

const createEmptyForm = (): IngredientFormValues => ({
	translations: {
		en: { name: '', description: '' },
		pt: { name: '', description: '' }
	},
	categoryId: '',
	kind: 'generic',
	brand: '',
	measurable: true,
	unitIds: []
});
const mockFormState = ref({
	form: createEmptyForm(),
	errors: [] as { field: string; message: string }[],
	displayErrors: false
});
const mockCheckError = vi.fn((_field: string): string => '');
const mockValidateForm = vi.fn();
const mockUpdateFormState = vi.fn();

// --- Category searchable select mock ---
const mockCategorySelected = ref({ label: '', value: '' });
const mockCategorySearchTerm = ref('');
const mockCategoryLoading = ref(false);
const mockCategoryOptions = ref([]);
const mockCategoryLoadNextPage = vi.fn();

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
	updateFormState: mockUpdateFormState
}));
vi.stubGlobal('useCategorySearchableSelect', () => ({
	options: computed(() => mockCategoryOptions.value),
	searchTerm: mockCategorySearchTerm,
	loading: computed(() => mockCategoryLoading.value),
	selected: mockCategorySelected,
	loadNextPage: mockCategoryLoadNextPage
}));
vi.stubGlobal('useI18n', () => ({
	t: (key: string) => (key === 'drinkDetailPage.ingredients.ofPreposition' ? 'of' : key),
	locale: ref('en')
}));
vi.stubGlobal('useLocalePath', () => (path: string) => path);

const globalStubs = {
	Form: FormStub,
	FormSection: FormSectionStub,
	Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
	Heading: { template: '<h1><slot /></h1>' },
	Text: { template: '<p><slot /></p>' },
	Button: { props: ['type'], template: '<button :type="type ?? \'button\'"><slot /></button>' },
	ArrowLeftIcon: true,
	InputWrapper: InputWrapperStub,
	Label: { template: '<label><slot /></label>', props: ['for'] },
	InputText: InputTextStub,
	InputSelectSearchable: InputSelectSearchableStub,
	InputSwitch: InputSwitchStub,
	ErrorMessage: ErrorMessageStub,
	GenderField: GenderFieldStub,
	RadioCardGroup: RadioCardGroupStub,
	UnitsSelection: UnitsSelectionStub
};

const mountIngredientForm = (props = {}) =>
	mount(IngredientForm, {
		props: { title: 'New ingredient', submitLabel: 'Create ingredient', ...props },
		global: {
			stubs: globalStubs,
			mocks: {
				$t: (key: string, params?: Record<string, unknown>) =>
					params ? `${key}:${JSON.stringify(params)}` : key
			}
		}
	});
const findPreview = (wrapper: ReturnType<typeof mountIngredientForm>) =>
	wrapper.find('[data-testid="ingredient-preview"]').text();

const teaspoon = {
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
};
const createIngredientProp = (overrides: Record<string, unknown> = {}) => ({
	id: 'ing-1',
	translations: {
		en: { name: 'Sugar' },
		pt: { name: 'Açúcar', gender: 'masculine' }
	},
	category: {
		id: 'cat-1',
		translations: { en: { name: 'Sweetener' }, pt: { name: 'Adoçante' } },
		isAlcoholic: false,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	units: [teaspoon],
	kind: 'generic',
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides
});

describe('IngredientForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = { form: createEmptyForm(), errors: [], displayErrors: false };
		mockCategorySelected.value = { label: '', value: '' };
		mockCheckError.mockReturnValue('');
	});

	describe('rendering', () => {
		it('renders the page header with a link back to the ingredients list', () => {
			const wrapper = mountIngredientForm();
			expect(wrapper.find('h1').text()).toBe('New ingredient');
			expect(wrapper.find('a').attributes('href')).toBe('/ingredients');
		});

		it('groups the fields in the names, type and classification sections', () => {
			const titles = mountIngredientForm()
				.findAll('section')
				.map((section) => section.attributes('data-title'));
			expect(titles).toEqual([
				'organisms.ingredientForm.namesSection.title',
				'organisms.ingredientForm.typeSection.title',
				'organisms.ingredientForm.classificationSection.title'
			]);
		});

		it('labels the submit button with the given text', () => {
			expect(mountIngredientForm().find('button[type="submit"]').text()).toBe(
				'Create ingredient'
			);
		});

		it('renders a name and a description text input per language', () => {
			const ids = mountIngredientForm()
				.findAllComponents(InputTextStub)
				.map((input) => input.props('id'));
			expect(ids).toEqual(['en-name', 'en-description', 'pt-name', 'pt-description']);
		});

		it('counts the characters of each description against the limit', () => {
			mockFormState.value.form.translations.pt.description = 'Licor de laranja';
			const text = mountIngredientForm().text();
			expect(text).toContain(
				'organisms.ingredientForm.descriptionInput.counter:{"count":0,"max":120}'
			);
			expect(text).toContain(
				'organisms.ingredientForm.descriptionInput.counter:{"count":16,"max":120}'
			);
		});

		it('asks for the gender only in the Portuguese column', () => {
			const ids = mountIngredientForm()
				.findAllComponents(GenderFieldStub)
				.map((field) => field.props('id'));
			expect(ids).toEqual(['pt-gender']);
		});

		it('renders the category select and no isAlcoholic switch (it lives on the category)', () => {
			const wrapper = mountIngredientForm();
			expect(
				wrapper
					.findAllComponents(InputSelectSearchableStub)
					.map((select) => select.props('id'))
			).toEqual(['category']);
			expect(wrapper.findAll('[role="switch"]').map((item) => item.attributes('id'))).toEqual(
				['measurable']
			);
		});
	});

	describe('type', () => {
		it('offers both kinds with their descriptions and starts on any brand', () => {
			const group = mountIngredientForm().findComponent(RadioCardGroupStub);
			expect(group.props('modelValue')).toBe('generic');
			expect(group.props('options')).toEqual([
				{
					value: 'generic',
					label: 'organisms.ingredientForm.kindInput.options.generic.label',
					description: 'organisms.ingredientForm.kindInput.options.generic.description'
				},
				{
					value: 'branded',
					label: 'organisms.ingredientForm.kindInput.options.branded.label',
					description: 'organisms.ingredientForm.kindInput.options.branded.description'
				}
			]);
		});

		it('does not ask for a brand while any brand works', () => {
			expect(mountIngredientForm().find('#brand').exists()).toBe(false);
		});

		it('asks for the brand once a specific brand is chosen, with its error', async () => {
			const wrapper = mountIngredientForm();
			wrapper.findComponent(RadioCardGroupStub).vm.$emit('update:modelValue', 'branded');
			await wrapper.vm.$nextTick();

			expect(mockFormState.value.form.kind).toBe('branded');
			expect(mockValidateForm).toHaveBeenCalled();
			expect(wrapper.find('#brand').exists()).toBe(true);
		});

		it('shows the error of the brand', () => {
			mockFormState.value.form.kind = 'branded';
			mockCheckError.mockImplementation((field) =>
				field === 'brand' ? 'errors.ingredients.brand' : ''
			);
			const wrapper = mountIngredientForm();
			expect(wrapper.find('#brand').attributes('data-error')).toBe('true');
			expect(wrapper.text()).toContain('errors.ingredients.brand');
		});

		it('ignores a kind that does not exist', async () => {
			const wrapper = mountIngredientForm();
			wrapper.findComponent(RadioCardGroupStub).vm.$emit('update:modelValue', 'exotic');
			await wrapper.vm.$nextTick();
			expect(mockFormState.value.form.kind).toBe('generic');
		});
	});

	describe('measurable and units', () => {
		it('lets the units be picked while the ingredient can be measured', () => {
			const wrapper = mountIngredientForm();
			expect(wrapper.find('[data-testid="units"]').exists()).toBe(true);
			expect(wrapper.find('#unit-none').exists()).toBe(false);
		});

		it('swaps the units for a disabled "no unit" field when it cannot be measured', async () => {
			const wrapper = mountIngredientForm();
			await wrapper.find('#measurable').trigger('click');

			expect(mockFormState.value.form.measurable).toBe(false);
			expect(wrapper.find('[data-testid="units"]').exists()).toBe(false);
			expect(wrapper.find('#unit-none').attributes('disabled')).toBeDefined();
			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('describes the switch with its help text', () => {
			const wrapper = mountIngredientForm();
			const describedBy = wrapper.find('#measurable').attributes('aria-describedby');
			expect(wrapper.find(`#${describedBy}`).text()).toBe(
				'organisms.ingredientForm.measurableInput.help'
			);
		});

		it('writes the picked units, in order, in the form and validates', async () => {
			const wrapper = mountIngredientForm();
			const second = { ...teaspoon, id: 'unit-2' };

			wrapper.findComponent(UnitsSelectionStub).vm.$emit('update:units', [second, teaspoon]);
			await wrapper.vm.$nextTick();

			expect(mockFormState.value.form.unitIds).toEqual(['unit-2', 'unit-1']);
			expect(wrapper.findComponent(UnitsSelectionStub).props('units')).toEqual([
				second,
				teaspoon
			]);
			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('passes the error of the units to the list', () => {
			mockCheckError.mockImplementation((field) =>
				field === 'unitIds' ? 'errors.ingredients.unit' : ''
			);
			expect(mountIngredientForm().findComponent(UnitsSelectionStub).props('error')).toBe(
				'errors.ingredients.unit'
			);
		});
	});

	describe('initialization', () => {
		it('calls updateFormState with mapped ingredient when prop is provided', () => {
			const ingredient = createIngredientProp({ kind: 'branded', brand: 'Domino' });
			mountIngredientForm({ ingredient });
			expect(mockUpdateFormState).toHaveBeenCalledWith({
				translations: {
					en: { name: 'Sugar', description: '' },
					pt: { name: 'Açúcar', description: '', gender: 'masculine' }
				},
				categoryId: 'cat-1',
				kind: 'branded',
				brand: 'Domino',
				measurable: true,
				unitIds: ['unit-1']
			});
		});

		it('does not call updateFormState without an ingredient', () => {
			mountIngredientForm();
			expect(mockUpdateFormState).not.toHaveBeenCalled();
		});

		it('sets categorySelected when ingredient prop is provided', () => {
			mountIngredientForm({ ingredient: createIngredientProp() });
			expect(mockCategorySelected.value).toEqual({ value: 'cat-1', label: 'Sweetener' });
		});

		it('hands the units of the ingredient being edited to the list', () => {
			const wrapper = mountIngredientForm({ ingredient: createIngredientProp() });
			expect(wrapper.findComponent(UnitsSelectionStub).props('units')).toEqual([teaspoon]);
		});
	});

	describe('category', () => {
		it('writes the picked category in the form', async () => {
			const wrapper = mountIngredientForm();
			wrapper
				.findComponent(InputSelectSearchableStub)
				.vm.$emit('update:modelValue', { value: 'cat-2', label: 'Spirit' });
			await wrapper.vm.$nextTick();
			expect(mockFormState.value.form.categoryId).toBe('cat-2');
		});
	});

	describe('preview', () => {
		it('explains what is missing until the name and a unit are known', () => {
			expect(findPreview(mountIngredientForm())).toContain(
				'organisms.ingredientForm.preview.emptyWithUnit'
			);
		});

		it('writes the ingredient with the first unit picked', async () => {
			mockFormState.value.form.translations.en.name = 'Sugar';
			const wrapper = mountIngredientForm();
			wrapper.findComponent(UnitsSelectionStub).vm.$emit('update:units', [teaspoon]);
			await wrapper.vm.$nextTick();

			expect(findPreview(wrapper)).toContain(
				'1 tsp of Sugar · 60 tsp of Sugar · 1.5 tsp of Sugar'
			);
		});

		it('uses the unit of the ingredient being edited', () => {
			mockFormState.value.form.translations.en.name = 'Sugar';
			expect(
				findPreview(mountIngredientForm({ ingredient: createIngredientProp() }))
			).toContain('60 tsp of Sugar');
		});

		it('is only the name when the ingredient cannot be measured', () => {
			mockFormState.value.form.translations.en.name = 'Ginger foam';
			mockFormState.value.form.measurable = false;
			expect(findPreview(mountIngredientForm())).toContain('Ginger foam');
			expect(findPreview(mountIngredientForm())).not.toContain(' of ');
		});

		it('explains that a name is missing when it cannot be measured', () => {
			mockFormState.value.form.measurable = false;
			expect(findPreview(mountIngredientForm())).toContain(
				'organisms.ingredientForm.preview.empty'
			);
		});

		it('adds the description, in the interface language', () => {
			mockFormState.value.form.translations.en = {
				name: 'Triple sec',
				description: ' Orange liqueur '
			};
			mockFormState.value.form.measurable = false;
			expect(findPreview(mountIngredientForm())).toContain('Orange liqueur');
		});
	});

	describe('validation', () => {
		it('calls validateForm on text input blur', async () => {
			const wrapper = mountIngredientForm();
			await wrapper.findComponent(InputTextStub).trigger('blur');
			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('validates when the gender field loses focus and passes it its error', () => {
			mockCheckError.mockImplementation((field) =>
				field === 'translations.pt.gender' ? 'errors.ingredients.gender' : ''
			);
			const wrapper = mountIngredientForm();
			const field = wrapper.findComponent(GenderFieldStub);
			expect(field.props('error')).toBe('errors.ingredients.gender');
			field.vm.$emit('blur');
			expect(mockValidateForm).toHaveBeenCalled();
		});

		it('writes the picked gender in the Portuguese translation only', async () => {
			const wrapper = mountIngredientForm();
			wrapper.findComponent(GenderFieldStub).vm.$emit('update:modelValue', 'feminine');
			await wrapper.vm.$nextTick();
			expect(mockFormState.value.form.translations.pt).toMatchObject({ gender: 'feminine' });
			expect(mockFormState.value.form.translations.en).not.toHaveProperty('gender');
		});

		it('passes hasError from checkError to InputText', () => {
			mockCheckError.mockReturnValue('errors.ingredients.name');
			const inputs = mountIngredientForm().findAllComponents(InputTextStub);
			expect(inputs.at(0)?.props('hasError')).toBe(true);
		});

		it('emits submit with form data when validation passes', async () => {
			const wrapper = mountIngredientForm();
			await wrapper.find('form').trigger('submit');
			expect(mockValidateForm).toHaveBeenCalled();
			expect(wrapper.emitted('submit')?.[0]).toEqual([mockFormState.value.form]);
		});

		it('does not emit submit when there are validation errors', async () => {
			mockValidateForm.mockImplementation(() => {
				mockFormState.value.errors = [
					{ field: 'categoryId', message: 'errors.ingredients.category' }
				];
			});
			const wrapper = mountIngredientForm();
			await wrapper.find('form').trigger('submit');
			expect(wrapper.emitted('submit')).toBeUndefined();
			mockValidateForm.mockReset();
		});

		it('shows errors from the first submit attempt', async () => {
			const wrapper = mountIngredientForm();
			await wrapper.find('form').trigger('submit');
			expect(mockFormState.value.displayErrors).toBe(true);
		});
	});

	describe('cancel', () => {
		it('emits cancel when the cancel button is clicked', async () => {
			const wrapper = mountIngredientForm();
			const cancel = wrapper
				.findAll('button')
				.find((button) => button.text() === 'organisms.ingredientForm.cancelButton');
			await cancel!.trigger('click');
			expect(wrapper.emitted('cancel')).toHaveLength(1);
		});
	});
});
