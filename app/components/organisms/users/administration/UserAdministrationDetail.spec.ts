import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import UserAdministrationDetail from './UserAdministrationDetail.vue';

const mockRouterPush = vi.fn();
const mockRefresh = vi.fn();
const mockActions = ref<string[]>([]);
const mockIsLoading = ref(false);
const mockHasError = ref(false);
const mockUser = ref<Record<string, unknown> | undefined>({ id: 'user-1', role: 'partner' });

vi.stubGlobal('useNuxtApp', () => ({ $router: { push: mockRouterPush } }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useUserAdministration', () => ({
	user: mockUser,
	capabilities: computed(() => ({ actions: mockActions.value, roleTransitions: ['member'] })),
	isLoading: mockIsLoading,
	hasError: mockHasError,
	can: (action: string) => mockActions.value.includes(action),
	refresh: mockRefresh
}));
const mockLoadPendingTransfer = vi.fn();
const mockInviteeId = ref<string | null>(null);
vi.stubGlobal('usePendingOwnershipTransfer', () => ({
	isInvitee: (userId: string) => mockInviteeId.value === userId,
	load: mockLoadPendingTransfer
}));

const TransferSectionStub = {
	name: 'UserOwnershipTransferSection',
	props: ['user', 'canRequest'],
	template: '<section data-testid="transfer-section" :data-can-request="String(canRequest)" />'
};

const ProfileSectionStub = {
	props: ['title', 'description', 'tone'],
	template: '<section data-testid="action-section"><slot name="action" /></section>'
};
const ReasonDialogStub = {
	name: 'UserReasonActionDialog',
	props: ['open', 'userId', 'action'],
	emits: ['update:open', 'completed'],
	template: '<div data-testid="reason-dialog" :data-open="open" :data-action="action" />'
};

const mountDetail = () =>
	mount(UserAdministrationDetail, {
		props: { userId: 'user-1' },
		global: {
			stubs: {
				Anchor: { template: '<a><slot /></a>' },
				Heading: { template: '<h1><slot /></h1>' },
				Text: { template: '<p><slot /></p>' },
				UserAdministrationSummary: { template: '<div data-testid="summary" />' },
				UserAdministrationSummarySkeleton: {
					template: '<div data-testid="summary-skeleton" />'
				},
				ProfileSection: ProfileSectionStub,
				Button: {
					emits: ['click'],
					template: '<button type="button" @click="$emit(\'click\')"><slot /></button>'
				},
				UserReasonActionDialog: ReasonDialogStub,
				ChangeUserRoleDialog: true,
				UserOwnershipTransferSection: TransferSectionStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UserAdministrationDetail', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockActions.value = ['changeRole', 'revokeSessions', 'suspend'];
		mockIsLoading.value = false;
		mockHasError.value = false;
		mockUser.value = { id: 'user-1', role: 'partner' };
		mockInviteeId.value = null;
	});

	it('loads the pending ownership transfer on mount', () => {
		mountDetail();

		expect(mockLoadPendingTransfer).toHaveBeenCalledTimes(1);
	});

	it('renders the dedicated transfer card when the backend allows a request', () => {
		mockActions.value = ['requestOwnershipTransfer'];
		const section = mountDetail().find('[data-testid="transfer-section"]');

		expect(section.exists()).toBe(true);
		expect(section.attributes('data-can-request')).toBe('true');
	});

	it('keeps the transfer card for the invitee even without the request capability', () => {
		mockActions.value = [];
		mockInviteeId.value = 'user-1';
		const section = mountDetail().find('[data-testid="transfer-section"]');

		expect(section.exists()).toBe(true);
		expect(section.attributes('data-can-request')).toBe('false');
	});

	it('hides the transfer card for anyone else without the capability', () => {
		mockActions.value = [];
		mockInviteeId.value = 'someone-else';

		expect(mountDetail().find('[data-testid="transfer-section"]').exists()).toBe(false);
	});

	it('renders the summary and only the actions granted by the backend', () => {
		const wrapper = mountDetail();

		expect(wrapper.find('[data-testid="summary"]').exists()).toBe(true);
		expect(wrapper.findAll('[data-testid="action-section"]')).toHaveLength(3);
		expect(wrapper.text()).toContain('organisms.userAdministration.actions.suspend');
		expect(wrapper.text()).not.toContain('organisms.userAdministration.actions.close');
	});

	it('shows the summary skeleton instead of the summary while loading', () => {
		mockIsLoading.value = true;
		const wrapper = mountDetail();

		expect(wrapper.find('[data-testid="summary-skeleton"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="summary"]').exists()).toBe(false);
	});

	it('explains when no administrative action is available', () => {
		mockActions.value = [];

		expect(mountDetail().text()).toContain('organisms.userAdministration.actions.none');
	});

	it('opens the reason dialog for the selected action', async () => {
		const wrapper = mountDetail();
		const suspendButton = wrapper
			.findAll('button')
			.find((button) => button.text() === 'organisms.userAdministration.actions.suspend');

		await suspendButton!.trigger('click');

		const dialog = wrapper.find('[data-testid="reason-dialog"]');
		expect(dialog.attributes('data-action')).toBe('suspend');
		expect(dialog.attributes('data-open')).toBe('true');
	});

	it('reloads after an action and returns to the list after a closure', async () => {
		mockActions.value = ['suspend'];
		const wrapper = mountDetail();
		await wrapper.find('button:not([disabled])').trigger('click');
		const dialog = wrapper.findComponent(ReasonDialogStub);

		dialog.vm.$emit('completed', 'suspend');
		await flushPromises();
		expect(mockRefresh).toHaveBeenCalledOnce();

		dialog.vm.$emit('completed', 'close');
		await flushPromises();
		expect(mockRouterPush).toHaveBeenCalledWith('/users');
	});

	it('shows the load error when the user cannot be loaded', () => {
		mockHasError.value = true;
		mockUser.value = undefined;

		expect(mountDetail().text()).toContain('organisms.userAdministration.loadErrorMessage');
	});
});
