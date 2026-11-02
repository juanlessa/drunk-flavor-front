import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import UsersControlOverview from './UsersControlOverview.vue';

const mockRouterPush = vi.fn();
const mockLoadNextPage = vi.fn();
const mockSearchTerm = ref('');
const mockIsEmpty = ref(false);
const mockOverviewState = ref({
	users: [] as { id: string }[],
	filter: { page: 1, limit: 30, isLastPage: false },
	searchTerm: '',
	loading: false
});

vi.stubGlobal('useNuxtApp', () => ({ $router: { push: mockRouterPush } }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useUsersOverview', () => ({
	overviewState: mockOverviewState,
	searchTerm: mockSearchTerm,
	isEmpty: mockIsEmpty,
	loadNextPage: mockLoadNextPage
}));
const mockLoadPendingTransfer = vi.fn();
vi.stubGlobal('usePendingOwnershipTransfer', () => ({
	isInvitee: (userId: string) => userId === 'user-2',
	load: mockLoadPendingTransfer
}));

const UserCardStub = {
	props: ['user', 'ownershipInvitee'],
	emits: ['click'],
	template:
		'<button data-testid="user-card" :data-invitee="String(ownershipInvitee)" @click="$emit(\'click\')">{{ user.id }}</button>'
};

const mountOverview = () =>
	mount(UsersControlOverview, {
		global: {
			stubs: {
				Text: { template: '<p><slot /></p>' },
				Label: { template: '<label><slot /></label>' },
				InputText: {
					props: ['modelValue', 'id'],
					emits: ['update:modelValue'],
					template:
						'<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
				},
				UserCardSkeleton: { template: '<div data-testid="skeleton" />' },
				UserCard: UserCardStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UsersControlOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearchTerm.value = '';
		mockIsEmpty.value = false;
		mockOverviewState.value = {
			users: [{ id: 'user-1' }, { id: 'user-2' }],
			filter: { page: 1, limit: 30, isLastPage: false },
			searchTerm: '',
			loading: false
		};
	});

	it('renders one card per loaded user and opens the selected one', async () => {
		const wrapper = mountOverview();
		const cards = wrapper.findAll('[data-testid="user-card"]');

		expect(cards).toHaveLength(2);
		await cards[1]!.trigger('click');

		expect(mockRouterPush).toHaveBeenCalledWith('/users/user-2');
	});

	it('loads the pending ownership transfer once for the whole list and marks its invitee', () => {
		const cards = mountOverview().findAll('[data-testid="user-card"]');

		expect(mockLoadPendingTransfer).toHaveBeenCalledTimes(1);
		expect(cards.map((card) => card.attributes('data-invitee'))).toEqual(['false', 'true']);
	});

	it('binds the search field to the overview search term', async () => {
		const wrapper = mountOverview();

		await wrapper.find('#users-search').setValue('ana');

		expect(mockSearchTerm.value).toBe('ana');
	});

	it('shows skeleton rows while loading', () => {
		mockOverviewState.value.loading = true;

		expect(mountOverview().findAll('[data-testid="skeleton"]').length).toBeGreaterThan(0);
	});

	it('shows the empty message when no user matches', () => {
		mockOverviewState.value.users = [];
		mockIsEmpty.value = true;

		expect(mountOverview().text()).toContain('organisms.usersControlOverview.emptyMessage');
	});
});
