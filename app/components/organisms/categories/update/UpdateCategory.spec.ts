import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, defineComponent, h, Suspense } from 'vue';
import UpdateCategory from './UpdateCategory.vue';

const CategoryFormStub = {
	template: '<div data-testid="category-form" />',
	props: ['categoryForm', 'title', 'submitLabel'],
	emits: ['submit', 'cancel']
};

const mockRouterBack = vi.fn();
const mockRouterReplace = vi.fn();
const mockCanUpdate = ref<boolean | undefined>(true);
const mockApiUpdate = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { categories: { getWithAuthorship: vi.fn(), update: mockApiUpdate } },
	$router: { back: mockRouterBack, replace: mockRouterReplace }
}));

vi.stubGlobal('useToast', () => ({
	addToast: mockAddToast
}));

vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));

const categoryData = {
	id: 'cat-1',
	translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } },
	createdAt: new Date(),
	updatedAt: new Date()
};

vi.stubGlobal('useAuthoredRecord', () => ({
	record: ref(categoryData),
	canUpdate: mockCanUpdate,
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
		mockCanUpdate.value = true;
		mockApiUpdate.mockResolvedValue({});
	});

	describe('rendering', () => {
		it('passes the edit title and submit label to the form', async () => {
			const form = (await mountUpdateCategory()).findComponent(CategoryFormStub);

			expect(form.props('title')).toBe('organisms.categoryForm.editTitle');
			expect(form.props('submitLabel')).toBe('organisms.categoryForm.saveButton');
		});

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

	describe('permission', () => {
		it('sends who cannot edit to the read-only view and shows no form', async () => {
			mockCanUpdate.value = false;

			const wrapper = await mountUpdateCategory();

			expect(mockRouterReplace).toHaveBeenCalledWith('/categories/cat-1');
			expect(wrapper.find('[data-testid="category-form"]').exists()).toBe(false);
		});

		it('waits for the answer before showing the form or redirecting', async () => {
			mockCanUpdate.value = undefined;

			const wrapper = await mountUpdateCategory();

			expect(mockRouterReplace).not.toHaveBeenCalled();
			expect(wrapper.find('[data-testid="category-form"]').exists()).toBe(false);
		});

		it('keeps the form for who can edit', async () => {
			const wrapper = await mountUpdateCategory();

			expect(mockRouterReplace).not.toHaveBeenCalled();
			expect(wrapper.find('[data-testid="category-form"]').exists()).toBe(true);
		});
	});
	describe('cancel', () => {
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
