import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReauthentication } from '~/composables/useReauthentication';
import ChangeUserRoleDialog from './ChangeUserRoleDialog.vue';

vi.mock('radix-vue/namespaced', () => {
	const component = (name: string) => ({ name, template: '<div><slot /></div>' });
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

const updateRole = vi.fn();
const addToast = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({ $api: { users: { updateRole } } }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast }));
vi.stubGlobal('useReauthentication', useReauthentication);

const InputSelectStub = {
	name: 'InputSelect',
	props: ['modelValue', 'options', 'id'],
	emits: ['update:modelValue', 'blur'],
	template: '<div :id="id" data-testid="role-select" />'
};

const mountDialog = () =>
	mount(ChangeUserRoleDialog, {
		props: { open: true, userId: 'user-1', roleTransitions: ['admin', 'member'] },
		global: {
			stubs: {
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { template: '<label><slot /></label>' },
				InputSelect: InputSelectStub,
				ErrorMessage: { props: ['value'], template: '<span>{{ value }}</span>' },
				ButtonGroup: { template: '<div><slot /></div>' },
				Button: {
					props: ['type', 'disabled'],
					template:
						'<button :type="type || \'button\'" :disabled="disabled"><slot /></button>'
				},
				ReauthenticationDialog: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('ChangeUserRoleDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		updateRole.mockResolvedValue(undefined);
	});

	it('offers only the role transitions granted by the backend', () => {
		const options = mountDialog().findComponent(InputSelectStub).props('options');

		expect(options).toEqual([
			{ label: 'users.roles.admin', value: 'admin' },
			{ label: 'users.roles.member', value: 'member' }
		]);
	});

	it('changes the role to the selected option', async () => {
		const wrapper = mountDialog();
		wrapper.findComponent(InputSelectStub).vm.$emit('update:modelValue', 'admin');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(updateRole).toHaveBeenCalledWith({ userId: 'user-1', role: 'admin' });
		expect(wrapper.emitted('completed')).toHaveLength(1);
	});

	it('requires a role before submitting and clears the error once one is picked', async () => {
		const wrapper = mountDialog();
		expect(wrapper.text()).not.toContain('errors.users.role');

		await wrapper.find('form').trigger('submit');
		await flushPromises();
		expect(updateRole).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain('errors.users.role');

		wrapper.findComponent(InputSelectStub).vm.$emit('update:modelValue', 'member');
		await flushPromises();
		expect(wrapper.text()).not.toContain('errors.users.role');
	});
});
