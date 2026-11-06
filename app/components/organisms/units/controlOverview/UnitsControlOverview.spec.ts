import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import UnitsControlOverview from './UnitsControlOverview.vue';

const mockRouterPush = vi.fn();
const mockLoadNextPage = vi.fn();
const mockDeleteUnit = vi.fn();
const mockAddToast = vi.fn();
const mockSearchTerm = ref('');
const mockIsEmpty = ref(false);
const mockScreenType = ref<'mobile' | 'tablet' | 'desktop'>('desktop');

const buildUnit = (id: string, name: string, kind: string, symbol?: string) => ({
	id,
	translations: { en: { name, namePlural: `${name}s` }, pt: { name, namePlural: `${name}s` } },
	symbol,
	kind
});

const mockOverviewState = ref({
	units: [] as ReturnType<typeof buildUnit>[],
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
const gridColumnsByScreen = { mobile: 1, tablet: 2, desktop: 3 };
vi.stubGlobal('useGridColumns', () => computed(() => gridColumnsByScreen[mockScreenType.value]));
vi.stubGlobal('useUnitsOverview', () => ({
	overviewState: mockOverviewState,
	searchTerm: mockSearchTerm,
	isEmpty: mockIsEmpty,
	deleteUnit: mockDeleteUnit,
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
			<slot :list="[{ data: items, index: 0 }]" :row-attrs="() => ({})" />
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

const mountOverview = () =>
	mount(UnitsControlOverview, {
		global: {
			stubs: {
				ClientOnly: { template: '<div><slot /></div>' },
				VirtualInfiniteGrid: VirtualInfiniteGridStub,
				ManagementItemCard: ManagementItemCardStub,
				ManagementItemCardSkeleton: { template: '<div data-testid="skeleton" />' },
				ManagementToolbar: ManagementToolbarStub,
				DeleteModal: DeleteModalStub,
				Text: { template: '<p><slot /></p>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UnitsControlOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearchTerm.value = '';
		mockIsEmpty.value = false;
		mockScreenType.value = 'desktop';
		mockDeleteUnit.mockResolvedValue(undefined);
		mockOverviewState.value = {
			units: [
				buildUnit('ml', 'Milliliter', 'volume', 'ml'),
				buildUnit('leaf', 'Leaf', 'count')
			],
			filter: { page: 1, limit: 30, isLastPage: false },
			searchTerm: '',
			loading: false
		};
	});

	it('renders one card per unit with its symbol and kind', () => {
		const cards = mountOverview().findAll('[data-testid="card-select"]');

		expect(cards).toHaveLength(2);
		expect(cards[0]!.text()).toBe(
			'Milliliter | ml · organisms.unitsControlOverview.kinds.volume'
		);
		expect(cards[1]!.text()).toBe('Leaf | organisms.unitsControlOverview.kinds.count');
	});

	it('opens the edit form of the selected unit', async () => {
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-select"]')[1]!.trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/units/leaf/edit');
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

		await wrapper.find('#units-search').setValue('gram');

		expect(mockSearchTerm.value).toBe('gram');
	});

	it('opens the create form from the toolbar', async () => {
		const wrapper = mountOverview();

		await wrapper.find('[data-testid="toolbar-create"]').trigger('click');

		expect(wrapper.find('[data-testid="toolbar-create"]').text()).toBe(
			'organisms.unitsControlOverview.createButton.value'
		);
		expect(mockRouterPush).toHaveBeenCalledWith('/units/new');
	});

	it('confirms and deletes the chosen unit', async () => {
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-delete"]')[0]!.trigger('click');
		expect(wrapper.find('[data-testid="delete-modal"]').text()).toContain(
			'organisms.unitsControlOverview.deleteModal.title:Milliliter'
		);

		await wrapper.find('[data-testid="confirm-delete"]').trigger('click');
		await vi.waitFor(() => expect(mockAddToast).toHaveBeenCalled());

		expect(mockDeleteUnit).toHaveBeenCalledWith('ml');
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('reports a failed deletion', async () => {
		mockDeleteUnit.mockRejectedValue(new Error('boom'));
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

	it('shows the empty message when no unit matches', () => {
		mockOverviewState.value.units = [];
		mockIsEmpty.value = true;

		expect(mountOverview().text()).toContain('organisms.unitsControlOverview.emptyMessage');
	});
});
