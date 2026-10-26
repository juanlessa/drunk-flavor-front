import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, defineComponent, h, Suspense } from 'vue';
import UpdateIngredient from './UpdateIngredient.vue';

const IngredientFormStub = {
	template: '<div data-testid="ingredient-form" />',
	props: ['ingredient'],
	emits: ['submit', 'cancel']
};

const mockRouterBack = vi.fn();
const mockApiGet = vi.fn();
const mockApiUpdate = vi.fn();
const mockResetFormState = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { ingredients: { get: mockApiGet, update: mockApiUpdate } },
	$router: { back: mockRouterBack }
}));

vi.stubGlobal('useIngredientForm', () => ({
	formState: { value: { form: {}, errors: [], displayErrors: false } },
	resetFormState: mockResetFormState,
	checkError: vi.fn(),
	validateForm: vi.fn(),
	updateFormState: vi.fn()
}));

vi.stubGlobal('useToast', () => ({
	addToast: mockAddToast
}));

const ingredientData = {
	_id: 'ing-1',
	translations: {
		en: { name: 'Sugar' },
		pt: { name: 'Açúcar' }
	},
	category: {
		_id: 'cat-1',
		translations: { en: { name: 'Sweetener' }, pt: { name: 'Adoçante' } },
		is_alcoholic: false,
		created_at: new Date(),
		updated_at: new Date()
	},
	unit: {
		_id: 'unit-1',
		translations: {
			en: { name: 'teaspoon', name_plural: 'teaspoons' },
			pt: { name: 'colher de chá', name_plural: 'colheres de chá' }
		},
		symbol: 'tsp',
		space_before_symbol: true,
		allow_decimal: true,
		kind: 'volume',
		created_at: new Date(),
		updated_at: new Date()
	},
	created_at: new Date(),
	updated_at: new Date()
};

vi.stubGlobal('useAsyncData', () => ({
	data: ref(ingredientData),
	error: ref(null)
}));

const ingredientFormPayload = {
	translations: {
		en: { name: 'Sugar' },
		pt: { name: 'Açúcar' }
	},
	category_id: 'cat-1',
	unit_id: 'unit-1'
};

const mountUpdateIngredient = async () => {
	const SuspenseWrapper = defineComponent({
		render() {
			return h(Suspense, null, {
				default: () => h(UpdateIngredient, { ingredientId: 'ing-1' })
			});
		}
	});

	const wrapper = mount(SuspenseWrapper, {
		global: {
			stubs: { IngredientForm: IngredientFormStub },
			mocks: { $t: (key: string) => key }
		}
	});
	await flushPromises();
	return wrapper;
};

describe('UpdateIngredient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApiUpdate.mockResolvedValue({});
	});

	describe('rendering', () => {
		it('renders IngredientForm', async () => {
			const wrapper = await mountUpdateIngredient();

			expect(wrapper.find('[data-testid="ingredient-form"]').exists()).toBe(true);
		});

		it('passes fetched ingredient to IngredientForm', async () => {
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			expect(form.props('ingredient')).toEqual(ingredientData);
		});
	});

	describe('cancel', () => {
		it('resets form state on cancel', async () => {
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockResetFormState).toHaveBeenCalled();
		});

		it('navigates back on cancel', async () => {
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockRouterBack).toHaveBeenCalled();
		});
	});

	describe('submit success', () => {
		it('calls API with mapped update data including id', async () => {
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await flushPromises();

			expect(mockApiUpdate).toHaveBeenCalledWith({
				id: 'ing-1',
				translations: ingredientFormPayload.translations,
				category_id: 'cat-1',
				unit_id: 'unit-1'
			});
		});

		it('shows success toast on API success', async () => {
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await flushPromises();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		});

		it('navigates back on API success', async () => {
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await flushPromises();

			expect(mockRouterBack).toHaveBeenCalled();
		});
	});

	describe('submit failure', () => {
		beforeEach(() => {
			vi.spyOn(console, 'error').mockImplementation(() => {});
		});

		it('shows error toast on API failure', async () => {
			mockApiUpdate.mockRejectedValue(new Error('Network error'));
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await flushPromises();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
		});

		it('does not navigate back on API failure', async () => {
			mockApiUpdate.mockRejectedValue(new Error('Network error'));
			const wrapper = await mountUpdateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await flushPromises();

			expect(mockRouterBack).not.toHaveBeenCalled();
		});
	});
});
