import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import CredentialsSignIn from './CredentialsSignIn.vue';

const mockSignin = vi.fn();
const mockValidateForm = vi.fn();
const mockResetFormState = vi.fn();
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
	resetFormState: mockResetFormState,
	validateForm: mockValidateForm
}));

const FormStub = {
	template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="buttons" /></form>',
	emits: ['submit']
};

const mountCredentialsSignIn = () =>
	mount(CredentialsSignIn, {
		global: {
			stubs: {
				Form: FormStub,
				Box: { template: '<div><slot /></div>' },
				InputWrapper: { template: '<div><slot name="label" /><slot /></div>' },
				Label: { template: '<label><slot /></label>' },
				InputText: true,
				InputPassword: true,
				ErrorMessage: true,
				Anchor: { template: '<a><slot /></a>' },
				ButtonGroup: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

const submit = async (wrapper: ReturnType<typeof mountCredentialsSignIn>) => {
	await wrapper.findComponent(FormStub).vm.$emit('submit');
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

	it('clears the form state when it leaves the page', () => {
		const wrapper = mountCredentialsSignIn();

		wrapper.unmount();

		expect(mockResetFormState).toHaveBeenCalled();
	});
});
