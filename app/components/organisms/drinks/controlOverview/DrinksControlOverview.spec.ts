import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { useDeleteModal } from '~/composables/ui/useDeleteModal';
import DrinksControlOverview from './DrinksControlOverview.vue';

const mockRouterPush = vi.fn();
const mockLoadNextPage = vi.fn();
const mockDeleteDrink = vi.fn();
const mockAddToast = vi.fn();
const mockSearchTerm = ref('');
const mockIsEmpty = ref(false);
const mockScreenType = ref<'mobile' | 'tablet' | 'desktop'>('desktop');

const buildDrink = (id: string, name: string, ingredients: number, thumbnailUrl?: string) => ({
	id,
	translations: { en: { name, method: '' }, pt: { name, method: '' } },
	ingredients: Array.from({ length: ingredients }, () => ({})),
	thumbnail: thumbnailUrl
		? { name: 'thumb', mimetype: 'image/png', url: thumbnailUrl }
		: undefined
});

const mockOverviewState = ref({
	drinks: [] as ReturnType<typeof buildDrink>[],
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
vi.stubGlobal('useDeleteModal', useDeleteModal);
const gridColumnsByScreen = { mobile: 1, tablet: 2, desktop: 3 };
vi.stubGlobal('useGridColumns', () => computed(() => gridColumnsByScreen[mockScreenType.value]));
vi.stubGlobal('useDrinksControlOverview', () => ({
	overviewState: mockOverviewState,
	searchTerm: mockSearchTerm,
	isEmpty: mockIsEmpty,
	deleteDrink: mockDeleteDrink,
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
			<slot name="media" />
			<button data-testid="card-select" @click="$emit('select')">{{ title }} | {{ description }}</button>
			<button data-testid="card-delete" @click="$emit('delete')" />
		</div>
	`
};

const ManagementItemCardSkeletonStub = {
	props: { media: Boolean },
	template: '<div data-testid="skeleton" :data-media="String(media)" />'
};

const ImageThumbnailStub = {
	props: ['src', 'srcFallback', 'srcFallbackDark', 'alt'],
	template: '<img data-testid="thumbnail" :src="src || srcFallback" :alt="alt" />'
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
	mount(DrinksControlOverview, {
		global: {
			stubs: {
				ClientOnly: { template: '<div><slot /></div>' },
				VirtualInfiniteGrid: VirtualInfiniteGridStub,
				ManagementItemCard: ManagementItemCardStub,
				ManagementItemCardSkeleton: ManagementItemCardSkeletonStub,
				ManagementToolbar: ManagementToolbarStub,
				ImageThumbnail: ImageThumbnailStub,
				DeleteModal: DeleteModalStub,
				Text: { template: '<p><slot /></p>' }
			},
			mocks: {
				$t: (key: string, count?: number) => (count === undefined ? key : `${key}:${count}`)
			}
		}
	});

describe('DrinksControlOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearchTerm.value = '';
		mockIsEmpty.value = false;
		mockScreenType.value = 'desktop';
		mockDeleteDrink.mockResolvedValue(undefined);
		mockOverviewState.value = {
			drinks: [
				buildDrink('mojito', 'Mojito', 5, '/mojito-thumb.png'),
				buildDrink('daiquiri', 'Daiquiri', 3)
			],
			filter: { page: 1, limit: 30, isLastPage: false },
			searchTerm: '',
			loading: false
		};
	});

	it('renders one card per drink with its ingredient count', () => {
		const cards = mountOverview().findAll('[data-testid="card-select"]');

		expect(cards).toHaveLength(2);
		expect(cards[0]!.text()).toBe(
			'Mojito | organisms.drinksControlOverview.ingredientsCount:5'
		);
		expect(cards[1]!.text()).toBe(
			'Daiquiri | organisms.drinksControlOverview.ingredientsCount:3'
		);
	});

	it('shows the thumbnail, falling back to the placeholder when the drink has none', () => {
		const thumbnails = mountOverview().findAll('[data-testid="thumbnail"]');

		expect(thumbnails[0]!.attributes('src')).toBe('/mojito-thumb.png');
		expect(thumbnails[1]!.attributes('src')).toBe('/thumbnail-placeholder.png');
		expect(thumbnails[0]!.attributes('alt')).toBe('');
	});

	it('opens the edit form of the selected drink', async () => {
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-select"]')[1]!.trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/drinks/daiquiri/edit');
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

		await wrapper.find('#drinks-search').setValue('moj');

		expect(mockSearchTerm.value).toBe('moj');
	});

	it('opens the create form from the toolbar', async () => {
		const wrapper = mountOverview();

		await wrapper.find('[data-testid="toolbar-create"]').trigger('click');

		expect(wrapper.find('[data-testid="toolbar-create"]').text()).toBe(
			'organisms.drinksControlOverview.createButton.value'
		);
		expect(mockRouterPush).toHaveBeenCalledWith('/drinks/new');
	});

	it('confirms and deletes the chosen drink', async () => {
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-delete"]')[0]!.trigger('click');
		expect(wrapper.find('[data-testid="delete-modal"]').text()).toContain(
			'organisms.drinksControlOverview.deleteModal.title:Mojito'
		);

		await wrapper.find('[data-testid="confirm-delete"]').trigger('click');
		await vi.waitFor(() => expect(mockAddToast).toHaveBeenCalled());

		expect(mockDeleteDrink).toHaveBeenCalledWith('mojito');
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('reports a failed deletion', async () => {
		mockDeleteDrink.mockRejectedValue(new Error('boom'));
		const wrapper = mountOverview();

		await wrapper.findAll('[data-testid="card-delete"]')[0]!.trigger('click');
		await wrapper.find('[data-testid="confirm-delete"]').trigger('click');
		await vi.waitFor(() => expect(mockAddToast).toHaveBeenCalled());

		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});

	it('shows skeleton cards with the thumbnail square while loading', () => {
		mockOverviewState.value.loading = true;
		const skeletons = mountOverview().findAll('[data-testid="skeleton"]');

		expect(skeletons.length).toBeGreaterThan(0);
		expect(skeletons[0]!.attributes('data-media')).toBe('true');
	});

	it('shows the empty message when no drink matches', () => {
		mockOverviewState.value.drinks = [];
		mockIsEmpty.value = true;

		expect(mountOverview().text()).toContain('organisms.drinksControlOverview.emptyMessage');
	});
});
