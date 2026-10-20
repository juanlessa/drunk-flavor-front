import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, defineComponent, h, Suspense } from 'vue';
import UpdateCategory from './UpdateCategory.vue';

const CategoryFormStub = {
	template: '<div data-testid="category-form" />',
	props: ['categoryForm'],
	emits: ['submit', 'cancel']
};

const mockRouterBack = vi.fn();
const mockApiGet = vi.fn();
const mockApiUpdate = vi.fn();
const mockResetFormState = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { categories: { get: mockApiGet, update: mockApiUpdate } },
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

const categoryData = {
	_id: 'cat-1',
	translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } },
	created_at: new Date(),
	updated_at: new Date()
};

vi.stubGlobal('useAsyncData', () => ({
	data: ref(categoryData),
	error: ref(null)
}));

const categoryFormPayload = {
	translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } }
};

const mountUpdateCategory = async () => {
	const SuspenseWrapper = defineComponent({
		render() {
			return h(Suspense, null, {
				default: () => h(UpdateCategory, { categoryId: 'cat-1' })
			});
		}
	});

	const wrapper = mount(SuspenseWrapper, {
		global: {
			stubs: { CategoryForm: CategoryFormStub },
			mocks: { $t: (key: string) => key }
		}
	});
	await flushPromises();
	return wrapper;
};

describe('UpdateCategory', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApiUpdate.mockResolvedValue({});
	});

	describe('rendering', () => {
		it('renders CategoryForm', async () => {
			const wrapper = await mountUpdateCategory();

			expect(wrapper.find('[data-testid="category-form"]').exists()).toBe(true);
		});

		it('passes mapped category form to CategoryForm', async () => {
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			expect(form.props('categoryForm')).toEqual({
				translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } }
			});
		});
	});

	describe('cancel', () => {
		it('resets form state on cancel', async () => {
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockResetFormState).toHaveBeenCalled();
		});

		it('navigates back on cancel', async () => {
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('cancel');
			await wrapper.vm.$nextTick();

			expect(mockRouterBack).toHaveBeenCalled();
		});
	});

	describe('submit success', () => {
		it('calls API with mapped update data including id', async () => {
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await flushPromises();

			expect(mockApiUpdate).toHaveBeenCalledWith({
				id: 'cat-1',
				translations: categoryFormPayload.translations
			});
		});

		it('shows success toast on API success', async () => {
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await flushPromises();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		});

		it('navigates back on API success', async () => {
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
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
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await flushPromises();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
		});

		it('does not navigate back on API failure', async () => {
			mockApiUpdate.mockRejectedValue(new Error('Network error'));
			const wrapper = await mountUpdateCategory();
			const form = wrapper.findComponent(CategoryFormStub);

			await form.vm.$emit('submit', categoryFormPayload);
			await flushPromises();

			expect(mockRouterBack).not.toHaveBeenCalled();
		});
	});
});
