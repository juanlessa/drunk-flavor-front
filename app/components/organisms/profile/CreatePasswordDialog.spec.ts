import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreatePasswordDialog from './CreatePasswordDialog.vue';

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

const createPassword = vi.fn();
const reauthenticateGoogle = vi.fn();
const authenticate = vi.fn();
const addToast = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({
	$api: { profile: { createPassword, reauthenticateGoogle } },
	$auth: { authenticate }
}));
vi.stubGlobal('useToast', () => ({ addToast }));

const InputPasswordStub = {
	props: ['modelValue', 'id'],
	emits: ['update:modelValue', 'blur', 'focus'],
	template:
		'<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
};
const GoogleIdentityButtonStub = {
	name: 'GoogleIdentityButton',
	emits: ['credential', 'error'],
	template:
		'<button type="button" data-testid="reauth" @click="$emit(\'credential\', \'google-token\')">Google</button>'
};
const mountDialog = () =>
	mount(CreatePasswordDialog, {
		props: { open: true, providers: ['google'] },
		global: {
			stubs: {
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { template: '<label><slot /></label>' },
				InputPassword: InputPasswordStub,
				ErrorMessage: { props: ['value'], template: '<span>{{ value }}</span>' },
				PasswordStrength: true,
				ButtonGroup: { template: '<div><slot /></div>' },
				Button: {
					props: ['type', 'disabled'],
					template:
						'<button :type="type || \'button\'" :disabled="disabled"><slot /></button>'
				},
				GoogleIdentityButton: GoogleIdentityButtonStub
			},
			mocks: { $t: (key: string) => key }
		}
	});
const fill = async (wrapper: ReturnType<typeof mountDialog>) => {
	await wrapper.find('#create-password').setValue('New-password-123456');
	await wrapper.find('#confirm-created-password').setValue('New-password-123456');
};

describe('CreatePasswordDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		createPassword.mockResolvedValue(undefined);
		reauthenticateGoogle.mockResolvedValue(undefined);
		authenticate.mockResolvedValue(true);
	});

	it('creates a password directly for a recently authenticated session', async () => {
		const wrapper = mountDialog();
		await fill(wrapper);
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(createPassword).toHaveBeenCalledWith({ password: 'New-password-123456' });
		expect(wrapper.emitted('update:open')).toContainEqual([false]);
		expect(authenticate).toHaveBeenCalledOnce();
	});

	it('requests Google step-up and retries after a stale-session response', async () => {
		createPassword
			.mockRejectedValueOnce({
				data: { localeKey: 'apiResponses.profile.recentAuthenticationRequired' }
			})
			.mockResolvedValue(undefined);
		const wrapper = mountDialog();
		await fill(wrapper);
		await wrapper.find('form').trigger('submit');
		await flushPromises();
		expect(wrapper.find('[data-testid="reauth"]').exists()).toBe(true);

		await wrapper.find('[data-testid="reauth"]').trigger('click');
		await flushPromises();

		expect(reauthenticateGoogle).toHaveBeenCalledWith({ idToken: 'google-token' });
		expect(createPassword).toHaveBeenCalledTimes(2);
	});

	it('never asks for a current password', () => {
		const wrapper = mountDialog();
		expect(wrapper.find('#current-password').exists()).toBe(false);
	});
});
