import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GoogleConnectionDialog from './GoogleConnectionDialog.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('radix-vue/namespaced', () => {
	const component = (name: string, template = '<div><slot /></div>') => ({ name, template });
	return {
		Dialog: {
			Root: component('DialogRoot'),
			Portal: component('DialogPortal'),
			Overlay: component('DialogOverlay'),
			Content: component('DialogContent'),
			Title: component('DialogTitle'),
			Description: component('DialogDescription'),
			Close: component('DialogClose')
		}
	};
});

const linkGoogleIdentity = vi.fn();
const authenticate = vi.fn();
const addToast = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({
	$api: { profile: { linkGoogleIdentity } },
	$auth: { authenticate }
}));
vi.stubGlobal('useToast', () => ({ addToast }));

const GoogleIdentityButtonStub = {
	name: 'GoogleIdentityButton',
	emits: ['credential', 'error'],
	template:
		'<button data-testid="google" @click="$emit(\'credential\', \'google-token\')">Google</button>'
};

const mountDialog = () =>
	mount(GoogleConnectionDialog, {
		props: { open: true },
		global: {
			stubs: {
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				GoogleIdentityButton: GoogleIdentityButtonStub,
				Button: { template: '<button><slot /></button>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('GoogleConnectionDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		linkGoogleIdentity.mockResolvedValue(undefined);
		authenticate.mockResolvedValue(true);
	});

	it('shows the Google linking action without collecting a password', () => {
		expect(mountDialog().find('[data-testid="google"]').exists()).toBe(true);
	});

	it('links the Google identity and refreshes the profile', async () => {
		const wrapper = mountDialog();
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(linkGoogleIdentity).toHaveBeenCalledWith({ idToken: 'google-token' });
		expect(wrapper.emitted('update:open')).toContainEqual([false]);
		expect(authenticate).toHaveBeenCalledOnce();
	});

	it('keeps the dialog open and reports a rejected link', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		linkGoogleIdentity.mockRejectedValue(new Error('invalid'));
		const wrapper = mountDialog();
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(wrapper.emitted('update:open')).toBeUndefined();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
