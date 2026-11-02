import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import OwnershipTransferPending from './OwnershipTransferPending.vue';

const mockResend = vi.fn();
const mockCancel = vi.fn();
const mockGetUser = vi.fn();
const mockAddToast = vi.fn();
const isReauthRequired = ref(false);
const mockRun = vi.fn(async (action: () => Promise<void>) => action());

vi.stubGlobal('useNuxtApp', () => ({ $api: { users: { get: mockGetUser } } }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));
vi.stubGlobal('usePendingOwnershipTransfer', () => ({ resend: mockResend, cancel: mockCancel }));
vi.stubGlobal('useReauthentication', () => ({
	isRequired: isReauthRequired,
	run: mockRun,
	confirm: vi.fn(),
	cancel: vi.fn()
}));

const DeleteModalStub = {
	name: 'DeleteModalStub',
	props: ['open', 'title', 'description', 'confirmLabel', 'cancelLabel'],
	emits: ['update:open', 'delete'],
	template: '<div data-testid="cancel-dialog" :data-open="String(open)" />'
};

const invitee = {
	id: 'admin-1',
	name: 'Maria',
	surname: 'Albuquerque',
	email: 'maria@example.com',
	role: 'admin'
};

const buildInvitation = (expiresInHours: number) => ({
	targetUserId: 'admin-1',
	reason: 'Handing over the project',
	expiresAt: new Date(Date.now() + expiresInHours * 3600 * 1000)
});

const mountPending = (props: Record<string, unknown> = {}) =>
	mount(OwnershipTransferPending, {
		props: { invitation: buildInvitation(18), ...props },
		global: {
			stubs: {
				Avatar: true,
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Badge: {
					props: ['value', 'tone'],
					template: '<span data-testid="badge" :data-tone="tone">{{ value }}</span>'
				},
				Text: { template: '<p><slot /></p>' },
				Button: {
					props: ['variant', 'disabled'],
					emits: ['click'],
					template:
						'<button :data-variant="variant" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>'
				},
				DeleteModal: DeleteModalStub,
				ReauthenticationDialog: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

const buttons = (wrapper: ReturnType<typeof mountPending>) => wrapper.findAll('button');

describe('OwnershipTransferPending', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		isReauthRequired.value = false;
		mockGetUser.mockResolvedValue(invitee);
		mockResend.mockResolvedValue(undefined);
		mockCancel.mockResolvedValue(undefined);
	});

	it('loads and links the invitee, and shows the reason and expiry', async () => {
		const wrapper = mountPending();
		await flushPromises();

		expect(mockGetUser).toHaveBeenCalledWith('admin-1');
		expect(wrapper.find('a').attributes('href')).toBe('/users/admin-1');
		expect(wrapper.text()).toContain('Maria Albuquerque');
		expect(wrapper.text()).toContain('Handing over the project');
		expect(wrapper.find('[data-testid="badge"]').attributes('data-tone')).toBe('accent');
		expect(buttons(wrapper)[0]!.attributes('data-variant')).toBe('outline');
	});

	it('uses the invitee given by the page without fetching it again', async () => {
		const wrapper = mountPending({ invitee, showInvitee: false });
		await flushPromises();

		expect(mockGetUser).not.toHaveBeenCalled();
		expect(wrapper.find('a').exists()).toBe(false);
		expect(wrapper.findComponent({ name: 'DeleteModalStub' }).props('description')).toBe(
			'organisms.ownershipTransfer.pending.cancelDialog.description'
		);
	});

	it('highlights an expired invitation and makes resending the main action', async () => {
		const wrapper = mountPending({ invitation: buildInvitation(-1) });
		await flushPromises();

		expect(wrapper.find('[data-testid="badge"]').attributes('data-tone')).toBe('warning');
		expect(wrapper.find('[data-testid="badge"]').text()).toBe(
			'organisms.ownershipTransfer.pending.expiredBadge'
		);
		expect(buttons(wrapper)[0]!.attributes('data-variant')).toBe('primary');
	});

	it('resends through the reauthentication guard and reports success', async () => {
		const wrapper = mountPending();
		await flushPromises();

		await buttons(wrapper)[0]!.trigger('click');
		await flushPromises();

		expect(mockRun).toHaveBeenCalledWith(mockResend);
		expect(mockResend).toHaveBeenCalled();
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('waits for reauthentication before reporting an outcome', async () => {
		mockRun.mockImplementationOnce(async () => {
			isReauthRequired.value = true;
		});
		const wrapper = mountPending();
		await flushPromises();

		await buttons(wrapper)[0]!.trigger('click');
		await flushPromises();

		expect(mockAddToast).not.toHaveBeenCalled();
	});

	it('asks for confirmation before cancelling', async () => {
		const wrapper = mountPending();
		await flushPromises();

		await buttons(wrapper)[1]!.trigger('click');
		const dialog = wrapper.findComponent({ name: 'DeleteModalStub' });
		expect(dialog.props('open')).toBe(true);
		expect(mockCancel).not.toHaveBeenCalled();

		dialog.vm.$emit('delete');
		await flushPromises();

		expect(mockCancel).toHaveBeenCalled();
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('reports a failed cancellation', async () => {
		mockCancel.mockRejectedValueOnce(new Error('nope'));
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const wrapper = mountPending();
		await flushPromises();

		wrapper.findComponent({ name: 'DeleteModalStub' }).vm.$emit('delete');
		await flushPromises();

		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
