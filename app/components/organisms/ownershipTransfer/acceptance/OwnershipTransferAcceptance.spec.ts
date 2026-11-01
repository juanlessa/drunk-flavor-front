import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReauthentication } from '~/composables/useReauthentication';
import OwnershipTransferAcceptance from './OwnershipTransferAcceptance.vue';

const accept = vi.fn();
const clear = vi.fn();
const addToast = vi.fn();
const navigateTo = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { ownershipTransfer: { accept } },
	$auth: { clear }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('navigateTo', navigateTo);
vi.stubGlobal('useReauthentication', useReauthentication);

const ReauthenticationDialogStub = {
	name: 'ReauthenticationDialog',
	props: ['open'],
	emits: ['reauthenticated', 'cancel'],
	template:
		'<button v-if="open" type="button" data-testid="reauth" @click="$emit(\'reauthenticated\')">reauth</button>'
};

const mountAcceptance = () =>
	mount(OwnershipTransferAcceptance, {
		props: { token: 'invitation-token' },
		global: {
			stubs: {
				Box: { template: '<div><slot /></div>' },
				Heading: { props: ['value'], template: '<h1>{{ value }}</h1>' },
				Text: { props: ['value'], template: '<p>{{ value }}</p>' },
				Anchor: { template: '<a><slot /></a>' },
				Button: {
					props: ['disabled'],
					emits: ['click'],
					template:
						'<button type="button" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>'
				},
				ReauthenticationDialog: ReauthenticationDialogStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

const clickAccept = async (wrapper: ReturnType<typeof mountAcceptance>) => {
	await wrapper.find('[data-testid="accept-ownership-button"]').trigger('click');
	await flushPromises();
};

describe('OwnershipTransferAcceptance', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		accept.mockResolvedValue(undefined);
		navigateTo.mockResolvedValue(undefined);
	});

	it('accepts the invitation and sends the new owner to sign in again', async () => {
		const wrapper = mountAcceptance();
		await clickAccept(wrapper);

		expect(accept).toHaveBeenCalledWith({ token: 'invitation-token' });
		expect(clear).toHaveBeenCalledOnce();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		expect(navigateTo).toHaveBeenCalledWith('/signin');
	});

	it('asks for reauthentication and retries after a stale-session response', async () => {
		accept
			.mockRejectedValueOnce({ data: { code: 'RECENT_AUTHENTICATION_REQUIRED' } })
			.mockResolvedValue(undefined);
		const wrapper = mountAcceptance();
		await clickAccept(wrapper);

		await wrapper.find('[data-testid="reauth"]').trigger('click');
		await flushPromises();

		expect(accept).toHaveBeenCalledTimes(2);
		expect(navigateTo).toHaveBeenCalledWith('/signin');
	});

	it('shows the invalid invitation message when the backend rejects the invitation', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		accept.mockRejectedValue({ data: { code: 'BAD_REQUEST' } });
		const wrapper = mountAcceptance();
		await clickAccept(wrapper);

		expect(wrapper.text()).toContain('organisms.ownershipTransfer.acceptance.invalidMessage');
		expect(wrapper.find('[data-testid="accept-ownership-button"]').exists()).toBe(false);
		expect(clear).not.toHaveBeenCalled();
	});

	it('keeps the invitation and reports an unexpected failure', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		accept.mockRejectedValue(new Error('network'));
		const wrapper = mountAcceptance();
		await clickAccept(wrapper);

		expect(wrapper.find('[data-testid="accept-ownership-button"]').exists()).toBe(true);
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
