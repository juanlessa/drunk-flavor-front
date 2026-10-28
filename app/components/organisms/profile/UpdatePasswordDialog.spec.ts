import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UpdatePasswordDialog from './UpdatePasswordDialog.vue';

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
const updatePassword = vi.fn();
const addToast = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({ $api: { profile: { updatePassword } } }));
vi.stubGlobal('useToast', () => ({ addToast }));
const InputPasswordStub = {
	props: ['modelValue', 'id'],
	emits: ['update:modelValue', 'blur', 'focus'],
	template:
		'<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
};
const mountDialog = () =>
	mount(UpdatePasswordDialog, {
		props: { open: true },
		global: {
			stubs: {
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { template: '<label><slot /></label>' },
				InputPassword: InputPasswordStub,
				ErrorMessage: true,
				PasswordStrength: true,
				ButtonGroup: { template: '<div><slot /></div>' },
				Button: {
					props: ['type'],
					template: '<button :type="type || \'button\'"><slot /></button>'
				}
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UpdatePasswordDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		updatePassword.mockResolvedValue(undefined);
	});
	it('requires and submits the current password', async () => {
		const wrapper = mountDialog();
		await wrapper.find('#current-password').setValue('Current-password-123');
		await wrapper.find('#new-password').setValue('New-password-456');
		await wrapper.find('#confirm-new-password').setValue('New-password-456');
		await wrapper.find('form').trigger('submit');
		await flushPromises();
		expect(updatePassword).toHaveBeenCalledWith({
			currentPassword: 'Current-password-123',
			newPassword: 'New-password-456'
		});
	});
});
