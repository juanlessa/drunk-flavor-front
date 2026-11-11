import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReauthentication } from '~/composables/auth/useReauthentication';
import RemovePasswordSection from './RemovePasswordSection.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

const removeAction = vi.fn();
const authenticate = vi.fn();
const addToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { profile: { removePassword: removeAction } },
	$auth: { authenticate }
}));
vi.stubGlobal('useToast', () => ({ addToast }));
vi.stubGlobal('useReauthentication', useReauthentication);

const ReauthenticationDialogStub = {
	name: 'ReauthenticationDialog',
	props: ['open'],
	emits: ['reauthenticated', 'cancel'],
	template:
		'<button v-if="open" type="button" data-testid="reauth" @click="$emit(\'reauthenticated\')">reauth</button>'
};
const DeleteModalStub = {
	name: 'DeleteModal',
	props: ['open'],
	emits: ['update:open', 'delete'],
	template: '<button data-testid="confirm" @click="$emit(\'delete\')">confirm</button>'
};

const mountSection = () =>
	mount(RemovePasswordSection, {
		global: {
			stubs: {
				ProfileSection: {
					props: ['title', 'description'],
					template:
						'<section><span>{{ title }}</span><slot name="icon" /><slot name="action" /></section>'
				},
				LockIcon: true,
				Button: {
					template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
					emits: ['click']
				},
				DeleteModal: DeleteModalStub,
				ReauthenticationDialog: ReauthenticationDialogStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('RemovePasswordSection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		removeAction.mockResolvedValue(undefined);
		authenticate.mockResolvedValue(undefined);
	});

	it('removes the method, reloads the profile and reports success', async () => {
		const wrapper = mountSection();

		await wrapper.find('[data-testid="confirm"]').trigger('click');
		await flushPromises();

		expect(removeAction).toHaveBeenCalledOnce();
		expect(authenticate).toHaveBeenCalledOnce();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('asks for reauthentication and retries after a stale-session response', async () => {
		removeAction
			.mockRejectedValueOnce({ data: { code: 'RECENT_AUTHENTICATION_REQUIRED' } })
			.mockResolvedValue(undefined);
		const wrapper = mountSection();

		await wrapper.find('[data-testid="confirm"]').trigger('click');
		await flushPromises();
		await wrapper.find('[data-testid="reauth"]').trigger('click');
		await flushPromises();

		expect(removeAction).toHaveBeenCalledTimes(2);
		expect(authenticate).toHaveBeenCalledOnce();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('reports an API failure without reloading the profile', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		removeAction.mockRejectedValue(new Error('network'));
		const wrapper = mountSection();

		await wrapper.find('[data-testid="confirm"]').trigger('click');
		await flushPromises();

		expect(authenticate).not.toHaveBeenCalled();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
