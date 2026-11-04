import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import CredentialsSignIn from './CredentialsSignIn.vue';

const mockSignin = vi.fn();
const mockValidateForm = vi.fn();
const mockFormState = ref({
	form: { email: '', password: '' },
	errors: [] as { field: string; message: string }[],
	displayErrors: false
});

vi.stubGlobal('useNuxtApp', () => ({ $api: { auth: { signin: mockSignin } } }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useSigninForm', () => ({
	formState: mockFormState,
	checkError: () => '',
	validateForm: mockValidateForm
}));

const mountCredentialsSignIn = () =>
	mount(CredentialsSignIn, {
		global: {
			stubs: {
				InputWrapper: { template: '<div><slot name="label" /><slot /></div>' },
				Label: { template: '<label><slot /></label>' },
				InputText: {
					props: ['placeholder'],
					template: '<input :placeholder="placeholder" />'
				},
				InputPassword: true,
				ErrorMessage: true,
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Button: {
					props: ['type', 'disabled'],
					template: '<button :type="type" :disabled="disabled"><slot /></button>'
				}
			},
			mocks: { $t: (key: string) => key }
		}
	});

const submit = async (wrapper: ReturnType<typeof mountCredentialsSignIn>) => {
	await wrapper.find('form').trigger('submit');
	await flushPromises();
};

describe('CredentialsSignIn', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = {
			form: { email: 'john@example.com', password: 'Password-1' },
			errors: [],
			displayErrors: false
		};
		mockSignin.mockResolvedValue(undefined);
	});

	it('signs in with the form credentials and emits success', async () => {
		const wrapper = mountCredentialsSignIn();

		await submit(wrapper);

		expect(mockSignin).toHaveBeenCalledWith({
			email: 'john@example.com',
			password: 'Password-1'
		});
		expect(wrapper.emitted('success')).toHaveLength(1);
	});

	it('does not call the API when validation fails', async () => {
		mockFormState.value.errors = [{ field: 'email', message: 'errors.users.email' }];
		const wrapper = mountCredentialsSignIn();

		await submit(wrapper);

		expect(mockSignin).not.toHaveBeenCalled();
		expect(wrapper.emitted('success')).toBeUndefined();
	});

	it('emits an error message when the API rejects the credentials', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		mockSignin.mockRejectedValue(new Error('401'));
		const wrapper = mountCredentialsSignIn();

		await submit(wrapper);

		expect(wrapper.emitted('error')).toEqual([['organisms.credentialsSignIn.error.message']]);
	});

	it('links password recovery next to the password label and submits from its own button', () => {
		const wrapper = mountCredentialsSignIn();

		expect(wrapper.find('a[href="/forgot-password"]').exists()).toBe(true);
		expect(wrapper.find('button[type="submit"]').text()).toBe(
			'organisms.credentialsSignIn.submitButton.value'
		);
		expect(wrapper.find('input').attributes('placeholder')).toBe(
			'organisms.credentialsSignIn.emailInput.placeholder'
		);
	});
});
