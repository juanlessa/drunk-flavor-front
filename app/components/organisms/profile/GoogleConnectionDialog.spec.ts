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
const InputPasswordStub = {
	props: ['modelValue', 'id'],
	emits: ['update:modelValue', 'blur'],
	template:
		'<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
};
const mountDialog = () =>
	mount(GoogleConnectionDialog, {
		props: { open: true },
		global: {
			stubs: {
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				InputWrapper: {
					template: '<div><slot name="label"/><slot/><slot name="error"/></div>'
				},
				Label: { template: '<label><slot /></label>' },
				InputPassword: InputPasswordStub,
				ErrorMessage: true,
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

	it('does not expose Google linking before the current password is entered', () => {
		const wrapper = mountDialog();
		expect(wrapper.find('[data-testid="google"]').exists()).toBe(false);
	});

	it('links both proven identities and refreshes the profile', async () => {
		const wrapper = mountDialog();
		await wrapper.find('#google-link-current-password').setValue('Current-password-123');
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(linkGoogleIdentity).toHaveBeenCalledWith({
			currentPassword: 'Current-password-123',
			idToken: 'google-token'
		});
		expect(wrapper.emitted('update:open')).toContainEqual([false]);
		expect(authenticate).toHaveBeenCalledOnce();
	});

	it('keeps the dialog open and reports a rejected link', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		linkGoogleIdentity.mockRejectedValue(new Error('invalid'));
		const wrapper = mountDialog();
		await wrapper.find('#google-link-current-password').setValue('Wrong-password-123');
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(wrapper.emitted('update:open')).toBeUndefined();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
