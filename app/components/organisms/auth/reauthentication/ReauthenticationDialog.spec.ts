import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReauthenticationDialog from './ReauthenticationDialog.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock('radix-vue/namespaced', () => {
	const component = (name: string, template = '<div><slot /></div>') => ({ name, template });
	return {
		Dialog: {
			Root: {
				name: 'DialogRoot',
				props: ['open'],
				emits: ['update:open'],
				template: '<div><slot /></div>'
			},
			Portal: component('DialogPortal'),
			Overlay: component('DialogOverlay'),
			Content: component('DialogContent'),
			Title: component('DialogTitle'),
			Description: component('DialogDescription'),
			Close: component('DialogClose')
		}
	};
});

const reauthenticatePassword = vi.fn();
const reauthenticateGoogle = vi.fn();
const addToast = vi.fn();
const authenticationMethods = { password: { enabled: true }, providers: ['google'] };
vi.stubGlobal('useNuxtApp', () => ({
	$api: { profile: { reauthenticatePassword, reauthenticateGoogle } },
	$auth: { state: ref({ user: { authenticationMethods } }) }
}));
vi.stubGlobal('useToast', () => ({ addToast }));

const mountDialog = () =>
	mount(ReauthenticationDialog, {
		props: { open: true },
		global: {
			stubs: {
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { template: '<label><slot /></label>' },
				InputPassword: {
					props: ['modelValue', 'id'],
					emits: ['update:modelValue', 'blur'],
					template:
						'<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
				},
				ErrorMessage: { props: ['value'], template: '<span>{{ value }}</span>' },
				Button: {
					props: ['type', 'disabled'],
					template:
						'<button :type="type || \'button\'" :disabled="disabled"><slot /></button>'
				},
				GoogleIdentityButton: {
					name: 'GoogleIdentityButton',
					emits: ['credential', 'error'],
					template:
						'<button type="button" data-testid="google" @click="$emit(\'credential\', \'google-token\')">Google</button>'
				}
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('ReauthenticationDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		reauthenticatePassword.mockResolvedValue(undefined);
		reauthenticateGoogle.mockResolvedValue(undefined);
	});

	it('reauthenticates with the password as typed', async () => {
		const wrapper = mountDialog();
		await wrapper.find('#reauthentication-password').setValue(' secret ');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(reauthenticatePassword).toHaveBeenCalledWith({ password: ' secret ' });
		expect(wrapper.emitted('reauthenticated')).toHaveLength(1);
	});

	it('reauthenticates with Google', async () => {
		const wrapper = mountDialog();
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(reauthenticateGoogle).toHaveBeenCalledWith({ idToken: 'google-token' });
		expect(wrapper.emitted('reauthenticated')).toHaveLength(1);
	});

	it('does not call the API with an empty password', async () => {
		const wrapper = mountDialog();
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(reauthenticatePassword).not.toHaveBeenCalled();
	});

	it('reports a failed reauthentication and stays open', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		reauthenticatePassword.mockRejectedValue(new Error('invalid'));
		const wrapper = mountDialog();
		await wrapper.find('#reauthentication-password').setValue('wrong');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(wrapper.emitted('reauthenticated')).toBeUndefined();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});

	it('emits cancel when the user closes the dialog', async () => {
		const wrapper = mountDialog();
		wrapper.findComponent({ name: 'DialogRoot' }).vm.$emit('update:open', false);
		await flushPromises();

		expect(wrapper.emitted('cancel')).toHaveLength(1);
	});
});
