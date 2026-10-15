import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateCategory from './CreateCategory.vue';

const CategoryFormStub = {
	template: '<div data-testid="category-form" />',
	emits: ['submit', 'cancel']
};

const mockRouterBack = vi.fn();
const mockApiCreate = vi.fn();
const mockResetFormState = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { categories: { create: mockApiCreate } },
	$router: { back: mockRouterBack }
}));

vi.stubGlobal('useCategoryForm', () => ({
	formState: { value: { form: {}, errors: [], displayErrors: false } },
	resetFormState: mockResetFormState,
	checkError: vi.fn(),
	validateForm: vi.fn(),
	updateFormState: vi.fn()
}));

vi.stubGlobal('useToast', () => ({
	addToast: mockAddToast
}));

const mountCreateCategory = () =>
	mount(CreateCategory, {
		global: {
			stubs: { CategoryForm: CategoryFormStub },
			mocks: {
				$t: (key: string) => key
			}
		}
	});

const categoryFormPayload = {
	translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } }
};

describe('CreateCategory', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApiCreate.mockResolvedValue({});
	});

	describe('rendering', () => {
		it('renders CategoryForm', () => {
			const wrapper = mountCreateCategory();

			expect(wrapper.find('[data-testid="category-form"]').exists()).toBe(true);
		});
	});

	describe('cancel', () => {
		it('resets form state on cancel', async () => {
			const wrapper = mountCreateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockResetFormState).toHaveBeenCalled();
		});

		it('navigates back on cancel', async () => {
			const wrapper = mountCreateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockRouterBack).toHaveBeenCalled();
		});
	});

	describe('submit success', () => {
		it('calls API with mapped category data', async () => {
			const wrapper = mountCreateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockApiCreate).toHaveBeenCalledWith({
				translations: categoryFormPayload.translations
			});
		});

		it('shows success toast on API success', async () => {
			const wrapper = mountCreateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockAddToast).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'success' })
			);
		});

		it('navigates back on API success', async () => {
			const wrapper = mountCreateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
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
			const wrapper = mountCreateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockAddToast).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'error' })
			);
		});

		it('does not navigate back on API failure', async () => {
			mockApiCreate.mockRejectedValue(new Error('Network error'));
			const wrapper = mountCreateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await wrapper.vm.$nextTick();

			expect(mockRouterBack).not.toHaveBeenCalled();
		});
	});
});
