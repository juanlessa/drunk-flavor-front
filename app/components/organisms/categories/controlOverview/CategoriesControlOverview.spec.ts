import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import CategoriesControlOverview from './CategoriesControlOverview.vue';

// --- Stubs ---
const ButtonGroupStub = {
	template: '<div data-testid="button-group"><slot /></div>'
};
const ButtonStub = {
	template: '<button data-testid="create-btn" @click="$emit(\'click\')"><slot /></button>',
	emits: ['click']
};
const VirtualInfiniteGridStub = {
	template: '<div data-testid="grid"><slot :list="items" /><slot name="loading" /></div>',
	props: ['items', 'height', 'itemHeight', 'itemsGap', 'gridColumns', 'loading'],
	emits: ['load-more']
};
const ItemControlCardStub = {
	template:
		'<div data-testid="item-card" @click="$emit(\'click\')">' +
		'<button data-testid="action-btn" @click.stop="$emit(\'action\')" /></div>',
	props: ['content'],
	emits: ['click', 'action']
};
const ItemControlCardSkeletonStub = {
	template: '<div data-testid="skeleton" />'
};
const DeleteModalStub = {
	template:
		'<div data-testid="delete-modal">' +
		'<slot name="title" /><slot name="description" /></div>',
	props: ['open'],
	emits: ['update:open', 'cancel', 'delete']
};
const ClientOnlyStub = {
	template: '<div><slot /></div>'
};

// --- Mocks ---
const mockRouterPush = vi.fn();
const mockDeleteCategory = vi.fn().mockResolvedValue({});
const mockLoadNextPage = vi.fn();
const mockAddToast = vi.fn();
const mockLocalePath = vi.fn((path: string) => path);

const mockOverviewState = ref({
	categories: [
		{
			id: 'cat-1',
			translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } },
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: 'cat-2',
			translations: { en: { name: 'Syrup' }, pt: { name: 'Xarope' } },
			createdAt: new Date(),
			updatedAt: new Date()
		}
	],
	filter: { page: 1, limit: 30, isLastPage: false },
	loading: false
});

vi.stubGlobal('useNuxtApp', () => ({
	$router: { push: mockRouterPush }
}));

vi.stubGlobal('useI18n', () => ({
	t: (key: string) => key,
	locale: ref('en')
}));

vi.stubGlobal('useLocalePath', () => mockLocalePath);

vi.stubGlobal('useToast', () => ({
	addToast: mockAddToast
}));

vi.stubGlobal('useCategoriesOverview', () => ({
	overviewState: mockOverviewState,
	deleteCategory: mockDeleteCategory,
	loadNextPage: mockLoadNextPage
}));

vi.stubGlobal('useScreenType', () => ({
	screenType: ref('desktop')
}));

const globalStubs = {
	ButtonGroup: ButtonGroupStub,
	Button: ButtonStub,
	VirtualInfiniteGrid: VirtualInfiniteGridStub,
	ItemControlCard: ItemControlCardStub,
	ItemControlCardSkeleton: ItemControlCardSkeletonStub,
	DeleteModal: DeleteModalStub,
	ClientOnly: ClientOnlyStub
};

const mountOverview = () =>
	mount(CategoriesControlOverview, {
		global: {
			stubs: globalStubs,
			mocks: {
				$t: (key: string) => key,
				$i18n: { locale: 'en' }
			}
		}
	});

describe('CategoriesControlOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockDeleteCategory.mockResolvedValue({});
		mockOverviewState.value = {
			categories: [
				{
					id: 'cat-1',
					translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } },
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: 'cat-2',
					translations: { en: { name: 'Syrup' }, pt: { name: 'Xarope' } },
					createdAt: new Date(),
					updatedAt: new Date()
				}
			],
			filter: { page: 1, limit: 30, isLastPage: false },
			loading: false
		};
	});

	describe('rendering', () => {
		it('renders a create button', () => {
			const wrapper = mountOverview();

			expect(wrapper.find('[data-testid="create-btn"]').exists()).toBe(true);
		});

		it('renders the virtual grid', () => {
			const wrapper = mountOverview();

			expect(wrapper.find('[data-testid="grid"]').exists()).toBe(true);
		});

		it('renders the delete modal', () => {
			const wrapper = mountOverview();

			expect(wrapper.find('[data-testid="delete-modal"]').exists()).toBe(true);
		});
	});

	describe('navigation', () => {
		it('navigates to create page on create button click', async () => {
			const wrapper = mountOverview();
			const btn = wrapper.find('[data-testid="create-btn"]');

			await btn.trigger('click');

			expect(mockRouterPush).toHaveBeenCalledWith('/categories/new');
		});
	});

	describe('delete flow', () => {
		it('calls deleteCategory on delete confirmation', async () => {
			const wrapper = mountOverview();
			const modal = wrapper.findComponent(DeleteModalStub);

			// Simulate triggerDeleteModal by emitting action from the card
			// The VirtualInfiniteGrid stub passes items in slot,
			// but the real iteration happens in the component template.
			// We test the modal interaction directly.
			await modal.vm.$emit('delete');
			await flushPromises();

			// Called with empty id because no category was selected via triggerDeleteModal
			// This validates the wiring: modal delete → deleteCategory call
			expect(mockDeleteCategory).toHaveBeenCalled();
		});

		it('shows success toast after successful delete', async () => {
			const wrapper = mountOverview();
			const modal = wrapper.findComponent(DeleteModalStub);

			await modal.vm.$emit('delete');
			await flushPromises();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		});

		it('shows error toast after failed delete', async () => {
			mockDeleteCategory.mockRejectedValue(new Error('fail'));
			const wrapper = mountOverview();
			const modal = wrapper.findComponent(DeleteModalStub);

			await modal.vm.$emit('delete');
			await flushPromises();

			expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
		});
	});
});
