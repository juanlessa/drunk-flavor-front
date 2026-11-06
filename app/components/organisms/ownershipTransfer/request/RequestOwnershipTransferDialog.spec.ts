import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReauthentication } from '~/composables/auth/useReauthentication';
import RequestOwnershipTransferDialog from './RequestOwnershipTransferDialog.vue';

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

const request = vi.fn();
const addToast = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({ $api: { ownershipTransfer: { request } } }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast }));
vi.stubGlobal('useReauthentication', useReauthentication);

const mountDialog = () =>
	mount(RequestOwnershipTransferDialog, {
		props: { open: true, targetUserId: 'admin-1' },
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
					props: ['type', 'disabled'],
					template:
						'<button :type="type || \'button\'" :disabled="disabled"><slot /></button>'
				},
				ReauthenticationDialog: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('RequestOwnershipTransferDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		request.mockResolvedValue(undefined);
	});

	it('invites the target admin with the trimmed reason', async () => {
		const wrapper = mountDialog();
		await wrapper.find('#ownership-transfer-reason').setValue('  Handing over operations  ');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(request).toHaveBeenCalledWith({
			targetUserId: 'admin-1',
			reason: 'Handing over operations'
		});
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		expect(wrapper.emitted('completed')).toHaveLength(1);
	});

	it('does not send the invitation without a valid reason', async () => {
		const wrapper = mountDialog();
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(request).not.toHaveBeenCalled();
	});
});
