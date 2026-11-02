import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReauthentication } from '~/composables/useReauthentication';
import UserReasonActionDialog from './UserReasonActionDialog.vue';

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

const suspend = vi.fn();
const close = vi.fn();
const addToast = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({
	$api: { users: { suspend, close, reactivate: vi.fn(), revokeSessions: vi.fn() } }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast }));
vi.stubGlobal('useReauthentication', useReauthentication);

const mountDialog = (action: 'suspend' | 'close' = 'suspend') =>
	mount(UserReasonActionDialog, {
		props: { open: true, userId: 'user-1', action },
		global: {
			stubs: {
				Heading: { template: '<h2><slot /></h2>' },
				Text: { template: '<p><slot /></p>' },
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { template: '<label><slot /></label>' },
				InputTextArea: {
					props: ['modelValue', 'id'],
					emits: ['update:modelValue', 'blur'],
					template:
						'<textarea :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
				},
				ErrorMessage: { props: ['value'], template: '<span>{{ value }}</span>' },
				ButtonGroup: { template: '<div><slot /></div>' },
				Button: {
					props: ['type', 'disabled', 'variant'],
					template:
						'<button :type="type || \'button\'" :disabled="disabled" :data-variant="variant"><slot /></button>'
				},
				ReauthenticationDialog: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UserReasonActionDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		suspend.mockResolvedValue(undefined);
		close.mockResolvedValue(undefined);
	});

	it('runs the action with the trimmed reason and reports completion', async () => {
		const wrapper = mountDialog();
		await wrapper
			.find('#user-administration-reason')
			.setValue('  Repeated policy violations  ');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(suspend).toHaveBeenCalledWith('user-1', { reason: 'Repeated policy violations' });
		expect(wrapper.emitted('completed')).toEqual([['suspend']]);
		expect(wrapper.emitted('update:open')).toContainEqual([false]);
	});

	it('shows no error before the first submit and clears it once the reason is valid', async () => {
		const wrapper = mountDialog();
		expect(wrapper.text()).not.toContain('errors.users.administrationReasonMinSize');

		await wrapper.find('form').trigger('submit');
		expect(wrapper.text()).toContain('errors.users.administrationReasonMinSize');

		await wrapper.find('#user-administration-reason').setValue('Repeated policy violations');
		expect(wrapper.text()).not.toContain('errors.users.administrationReasonMinSize');
	});

	it('does not call the API when the reason is too short', async () => {
		const wrapper = mountDialog();
		await wrapper.find('#user-administration-reason').setValue('short');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(suspend).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain('errors.users.administrationReasonMinSize');
	});

	it('uses the destructive button for a closure and reports a failure', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		close.mockRejectedValue(new Error('conflict'));
		const wrapper = mountDialog('close');
		expect(wrapper.find('[type="submit"]').attributes('data-variant')).toBe('delete');

		await wrapper.find('#user-administration-reason').setValue('Account requested deletion');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(wrapper.emitted('completed')).toBeUndefined();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
