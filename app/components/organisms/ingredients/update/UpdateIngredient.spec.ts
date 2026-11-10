import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, defineComponent, h, Suspense } from 'vue';
import UpdateIngredient from './UpdateIngredient.vue';

const IngredientFormStub = {
	template: '<div data-testid="ingredient-form" />',
	props: ['ingredient', 'title', 'submitLabel'],
	emits: ['submit', 'cancel']
};

const mockRouterBack = vi.fn();
const mockRouterReplace = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(true);
const mockApiUpdate = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { ingredients: { getWithAuthorship: vi.fn(), update: mockApiUpdate } },
	$router: { back: mockRouterBack, replace: mockRouterReplace }
}));

vi.stubGlobal('useToast', () => ({
	addToast: mockAddToast
}));

vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));

const ingredientData = {
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
	units: [
		{
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
		}
	],
	createdAt: new Date(),
	updatedAt: new Date()
};

vi.stubGlobal('useAuthoredRecord', () => ({
	record: ref(ingredientData),
	canUpdate: mockCanUpdate,
	error: ref(null)
}));

const ingredientFormPayload = {
	translations: {
		en: { name: 'Sugar', description: '' },
		pt: { name: 'Açúcar', description: '', gender: 'masculine' as const }
	},
	categoryId: 'cat-1',
	kind: 'generic' as const,
	brand: '',
	measurable: true,
	unitIds: ['unit-1']
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
		mockCanUpdate.value = true;
		mockApiUpdate.mockResolvedValue({});
	});

	describe('rendering', () => {
		it('passes the edit title and submit label to the form', async () => {
			const form = (await mountUpdateIngredient()).findComponent(IngredientFormStub);

			expect(form.props('title')).toBe('organisms.ingredientForm.editTitle');
			expect(form.props('submitLabel')).toBe('organisms.ingredientForm.saveButton');
		});

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

	describe('permission', () => {
		it('sends who cannot edit to the read-only view and shows no form', async () => {
			mockCanUpdate.value = false;

			const wrapper = await mountUpdateIngredient();

			expect(mockRouterReplace).toHaveBeenCalledWith('/ingredients/ing-1');
			expect(wrapper.find('[data-testid="ingredient-form"]').exists()).toBe(false);
		});

		it('waits for the answer before showing the form or redirecting', async () => {
			mockCanUpdate.value = undefined;

			const wrapper = await mountUpdateIngredient();

			expect(mockRouterReplace).not.toHaveBeenCalled();
			expect(wrapper.find('[data-testid="ingredient-form"]').exists()).toBe(false);
		});

		it('keeps the form for who can edit', async () => {
			const wrapper = await mountUpdateIngredient();

			expect(mockRouterReplace).not.toHaveBeenCalled();
			expect(wrapper.find('[data-testid="ingredient-form"]').exists()).toBe(true);
		});
	});
	describe('cancel', () => {
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
				translations: {
					en: { name: 'Sugar', namePlural: null, description: null },
					pt: { name: 'Açúcar', namePlural: null, description: null, gender: 'masculine' }
				},
				categoryId: 'cat-1',
				unitIds: ['unit-1'],
				kind: 'generic',
				brand: null
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
