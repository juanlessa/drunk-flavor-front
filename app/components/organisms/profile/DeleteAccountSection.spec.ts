import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeleteAccountSection from './DeleteAccountSection.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

const deleteProfile = vi.fn();
const clear = vi.fn();
const addToast = vi.fn();
const navigateTo = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { profile: { delete: deleteProfile } },
	$auth: { clear }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('navigateTo', navigateTo);

const DeleteModalStub = {
	name: 'DeleteModal',
	props: ['open'],
	emits: ['update:open', 'delete'],
	template: '<button data-testid="confirm-delete" @click="$emit(\'delete\')">confirm</button>'
};

const mountSection = () =>
	mount(DeleteAccountSection, {
		global: {
			stubs: {
				ProfileSection: {
					template: '<section><slot name="icon" /><slot name="action" /></section>'
				},
				TrashIcon: true,
				Button: {
					template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
					emits: ['click']
				},
				DeleteModal: DeleteModalStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('DeleteAccountSection', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		deleteProfile.mockResolvedValue(undefined);
		navigateTo.mockResolvedValue(undefined);
	});

	it('deletes the account, clears local auth and returns home', async () => {
		const wrapper = mountSection();
		await wrapper.find('[data-testid="confirm-delete"]').trigger('click');
		await flushPromises();

		expect(deleteProfile).toHaveBeenCalledOnce();
		expect(clear).toHaveBeenCalledOnce();
		expect(navigateTo).toHaveBeenCalledWith('/');
	});

	it('keeps auth state and reports an API failure', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		deleteProfile.mockRejectedValue(new Error('network'));
		const wrapper = mountSection();
		await wrapper.find('[data-testid="confirm-delete"]').trigger('click');
		await flushPromises();

		expect(clear).not.toHaveBeenCalled();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
