import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import IngredientsControlOverview from './IngredientsControlOverview.vue';

const mockRouterPush = vi.fn();
const mockLoadNextPage = vi.fn();
const mockDeleteIngredient = vi.fn();
const mockAddToast = vi.fn();
const mockSearchTerm = ref('');
const mockIsEmpty = ref(false);
const mockScreenType = ref<'mobile' | 'tablet' | 'desktop'>('desktop');

const buildIngredient = (id: string, name: string) => ({
	id,
	translations: { en: { name }, pt: { name } },
	category: { translations: { en: { name: 'Spirit' }, pt: { name: 'Destilado' } } },
	unit: { symbol: 'ml', translations: { en: { name: 'milliliter' }, pt: { name: 'mililitro' } } }
});

const mockOverviewState = ref({
	ingredients: [] as ReturnType<typeof buildIngredient>[],
	filter: { page: 1, limit: 30, isLastPage: false },
	searchTerm: '',
	loading: false
});

vi.stubGlobal('useNuxtApp', () => ({ $router: { push: mockRouterPush } }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useI18n', () => ({
	t: (key: string, params?: { name?: string }) => (params?.name ? `${key}:${params.name}` : key),
	locale: ref('en')
}));
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));
vi.stubGlobal('useScreenType', () => ({ screenType: mockScreenType }));
vi.stubGlobal('useIngredientsOverview', () => ({
	overviewState: mockOverviewState,
	searchTerm: mockSearchTerm,
	isEmpty: mockIsEmpty,
	deleteIngredient: mockDeleteIngredient,
	loadNextPage: mockLoadNextPage
}));
vi.stubGlobal(
	'ResizeObserver',
	class {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
);

// Renders every item in a single row and exposes the configured column count.
const VirtualInfiniteGridStub = {
	props: ['items', 'gridColumns', 'loading'],
	template: `
		<div data-testid="grid" :data-columns="gridColumns">
			<slot :list="[{ data: items, index: 0 }]" />
			<slot v-if="loading" name="loading" />
		</div>
	`
};

const ManagementItemCardStub = {
	props: ['title', 'description'],
	emits: ['select', 'delete'],
	template: `
		<div data-testid="card">
			<button data-testid="card-select" @click="$emit('select')">{{ title }} | {{ description }}</button>
			<button data-testid="card-delete" @click="$emit('delete')" />
		</div>
	`
};

const DeleteModalStub = {
	props: ['open'],
	emits: ['update:open', 'cancel', 'delete'],
	template: `
		<div v-if="open" data-testid="delete-modal">
			<slot name="title" />
			<button data-testid="confirm-delete" @click="$emit('delete')" />
		</div>
	`
};

const ManagementToolbarStub = {
	props: ['searchTerm', 'searchId', 'createLabel'],
	emits: ['update:searchTerm', 'create'],
	template: `
		<div>
			<input :id="searchId" :value="searchTerm" @input="$emit('update:searchTerm', $event.target.value)" />
			<button data-testid="toolbar-create" @click="$emit('create')">{{ createLabel }}</button>
		</div>
	`
};

const mountOverview = () =>
	mount(IngredientsControlOverview, {
		global: {
			stubs: {
				ClientOnly: { template: '<div><slot /></div>' },
				VirtualInfiniteGrid: VirtualInfiniteGridStub,
				ManagementItemCard: ManagementItemCardStub,
				ManagementItemCardSkeleton: { template: '<div data-testid="skeleton" />' },
				DeleteModal: DeleteModalStub,
				ManagementToolbar: ManagementToolbarStub,
				Text: { template: '<p><slot /></p>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('IngredientsControlOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearchTerm.value = '';
		mockIsEmpty.value = false;
		mockScreenType.value = 'desktop';
		mockDeleteIngredient.mockResolvedValue(undefined);
		mockOverviewState.value = {
			ingredients: [buildIngredient('gin', 'Gin'), buildIngredient('rum', 'White rum')],
			filter: { page: 1, limit: 30, isLastPage: false },
			searchTerm: '',
			loading: false
		};
	});

	it('renders one card per ingredient with the category and unit summary', () => {
		const cards = mountOverview().findAll('[data-testid="card-select"]');

		expect(cards).toHaveLength(2);
		expect(cards[0]!.text()).toBe('Gin | Spirit · ml');
	});

	it('opens the edit form of the selected ingredient', async () => {
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-select"]')[1]!.trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/ingredients/rum/edit');
	});

	it.each([
		['desktop', '3'],
		['tablet', '2'],
		['mobile', '1']
	] as const)('uses the %s column count', (screenType, columns) => {
		mockScreenType.value = screenType;

		expect(mountOverview().find('[data-testid="grid"]').attributes('data-columns')).toBe(
			columns
		);
	});

	it('binds the toolbar search to the overview search term', async () => {
		const wrapper = mountOverview();

		await wrapper.find('#ingredients-search').setValue('gin');

		expect(mockSearchTerm.value).toBe('gin');
	});

	it('opens the create form from the toolbar', async () => {
		const wrapper = mountOverview();

		await wrapper.find('[data-testid="toolbar-create"]').trigger('click');

		expect(wrapper.find('[data-testid="toolbar-create"]').text()).toBe(
			'organisms.ingredientsControlOverview.createButton.value'
		);
		expect(mockRouterPush).toHaveBeenCalledWith('/ingredients/new');
	});

	it('confirms and deletes the chosen ingredient', async () => {
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-delete"]')[0]!.trigger('click');
		expect(wrapper.find('[data-testid="delete-modal"]').text()).toContain(
			'organisms.ingredientsControlOverview.deleteModal.title:Gin'
		);

		await wrapper.find('[data-testid="confirm-delete"]').trigger('click');
		await vi.waitFor(() => expect(mockAddToast).toHaveBeenCalled());

		expect(mockDeleteIngredient).toHaveBeenCalledWith('gin');
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('reports a failed deletion', async () => {
		mockDeleteIngredient.mockRejectedValue(new Error('boom'));
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-delete"]')[0]!.trigger('click');
		await wrapper.find('[data-testid="confirm-delete"]').trigger('click');
		await vi.waitFor(() => expect(mockAddToast).toHaveBeenCalled());

		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});

	it('shows skeleton cards while loading', () => {
		mockOverviewState.value.loading = true;

		expect(mountOverview().findAll('[data-testid="skeleton"]').length).toBeGreaterThan(0);
	});

	it('shows the empty message when no ingredient matches', () => {
		mockOverviewState.value.ingredients = [];
		mockIsEmpty.value = true;

		expect(mountOverview().text()).toContain(
			'organisms.ingredientsControlOverview.emptyMessage'
		);
	});
});
