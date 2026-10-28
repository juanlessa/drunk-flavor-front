import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateIngredient from './CreateIngredient.vue';

const IngredientFormStub = {
	template: '<div data-testid="ingredient-form" />',
	emits: ['submit', 'cancel']
};

const mockRouterBack = vi.fn();
const mockApiCreate = vi.fn();
const mockResetFormState = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { ingredients: { create: mockApiCreate } },
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

const mountCreateIngredient = () =>
	mount(CreateIngredient, {
		global: {
			stubs: { IngredientForm: IngredientFormStub },
			mocks: { $t: (key: string) => key }
		}
	});

const ingredientFormPayload = {
	translations: {
		en: { name: 'Sugar' },
		pt: { name: 'Açúcar' }
	},
	categoryId: 'cat-1',
	unitId: 'unit-1'
};

describe('CreateIngredient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApiCreate.mockResolvedValue({});
	});

	describe('rendering', () => {
		it('renders IngredientForm', () => {
			const wrapper = mountCreateIngredient();

			expect(wrapper.find('[data-testid="ingredient-form"]').exists()).toBe(true);
		});
	});

	describe('cancel', () => {
		it('resets form state on cancel', async () => {
			const wrapper = mountCreateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockResetFormState).toHaveBeenCalled();
		});

		it('navigates back on cancel', async () => {
			const wrapper = mountCreateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockRouterBack).toHaveBeenCalled();
		});
	});

	describe('submit success', () => {
		it('calls API with mapped ingredient data', async () => {
			const wrapper = mountCreateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockApiCreate).toHaveBeenCalledWith({
				translations: ingredientFormPayload.translations,
				categoryId: 'cat-1',
				unitId: 'unit-1'
			});
		});

		it('shows success toast on API success', async () => {
			const wrapper = mountCreateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		});

		it('navigates back on API success', async () => {
			const wrapper = mountCreateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockRouterBack).toHaveBeenCalled();
		});
	});

	describe('submit failure', () => {
		beforeEach(() => {
			vi.spyOn(console, 'error').mockImplementation(() => {});
		});

		it('shows error toast on API failure', async () => {
			mockApiCreate.mockRejectedValue(new Error('Network error'));
			const wrapper = mountCreateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
		});

		it('does not navigate back on API failure', async () => {
			mockApiCreate.mockRejectedValue(new Error('Network error'));
			const wrapper = mountCreateIngredient();
			const form = wrapper.findComponent(IngredientFormStub);

			await form.vm.$emit('submit', ingredientFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockRouterBack).not.toHaveBeenCalled();
		});
	});
});
