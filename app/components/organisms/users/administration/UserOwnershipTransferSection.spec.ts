import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import type { User } from '~/domain/user/user.entity';
import UserOwnershipTransferSection from './UserOwnershipTransferSection.vue';

const mockGetUser = vi.fn();
const mockLoad = vi.fn();
const mockInvitation = ref<{ targetUserId: string; reason: string; expiresAt: Date } | null>(null);

vi.stubGlobal('useNuxtApp', () => ({ $api: { users: { get: mockGetUser } } }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('usePendingOwnershipTransfer', () => ({
	invitation: computed(() => mockInvitation.value),
	isLoaded: computed(() => true),
	isInvitee: (userId: string) => mockInvitation.value?.targetUserId === userId,
	load: mockLoad
}));

const user = {
	id: 'admin-1',
	name: 'Maria',
	surname: 'Albuquerque',
	email: 'm@example.com',
	role: 'admin'
} as User;
const invitationFor = (targetUserId: string) => ({
	targetUserId,
	reason: 'Handing over the project',
	expiresAt: new Date(Date.now() + 3600 * 1000)
});

const PendingStub = {
	name: 'OwnershipTransferPending',
	props: ['invitation', 'invitee', 'showInvitee'],
	template: '<div data-testid="pending" />'
};
const RequestDialogStub = {
	name: 'RequestOwnershipTransferDialog',
	props: ['open', 'targetUserId'],
	emits: ['update:open', 'completed'],
	template: '<div data-testid="request-dialog" :data-open="String(open)" />'
};

const mountSection = (canRequest = true) =>
	mount(UserOwnershipTransferSection, {
		props: { user, canRequest },
		global: {
			stubs: {
				ProfileSection: {
					props: ['title', 'description'],
					template:
						'<section data-testid="section" :data-description="description"><slot name="action" /><slot /></section>'
				},
				Button: {
					props: ['disabled'],
					emits: ['click'],
					template:
						'<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>'
				},
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				OwnershipTransferPending: PendingStub,
				RequestOwnershipTransferDialog: RequestDialogStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UserOwnershipTransferSection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInvitation.value = null;
		mockGetUser.mockResolvedValue({ id: 'admin-2', name: 'Pedro', email: 'p@example.com' });
	});

	it('offers a new request when no invitation is pending', async () => {
		const wrapper = mountSection();

		await wrapper.find('button').trigger('click');

		expect(wrapper.find('[data-testid="pending"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="request-dialog"]').attributes('data-open')).toBe('true');
	});

	it('reloads the pending invitation after a request is sent', () => {
		const wrapper = mountSection();

		wrapper.findComponent({ name: 'RequestOwnershipTransferDialog' }).vm.$emit('completed');

		expect(mockLoad).toHaveBeenCalled();
	});

	it('manages the pending invitation on the invitee page', () => {
		mockInvitation.value = invitationFor('admin-1');
		const wrapper = mountSection();
		const pending = wrapper.findComponent({ name: 'OwnershipTransferPending' });

		expect(pending.exists()).toBe(true);
		expect(pending.props('invitee')).toEqual(user);
		expect(pending.props('showInvitee')).toBe(false);
		expect(wrapper.find('[data-testid="section"]').attributes('data-description')).toBe(
			'organisms.ownershipTransfer.pending.thisUserDescription'
		);
	});

	it('blocks a new request while someone else is invited and links to them', async () => {
		mockInvitation.value = invitationFor('admin-2');
		const wrapper = mountSection();
		await flushPromises();

		expect(mockGetUser).toHaveBeenCalledWith('admin-2');
		expect(wrapper.find('a').attributes('href')).toBe('/users/admin-2');
		expect(wrapper.find('button').attributes('disabled')).toBeDefined();
		expect(wrapper.find('[data-testid="pending"]').exists()).toBe(false);
	});

	it('stays hidden without the capability unless this user is the invitee', () => {
		expect(mountSection(false).find('[data-testid="section"]').exists()).toBe(false);

		mockInvitation.value = invitationFor('admin-1');
		expect(mountSection(false).find('[data-testid="section"]').exists()).toBe(true);
	});
});
