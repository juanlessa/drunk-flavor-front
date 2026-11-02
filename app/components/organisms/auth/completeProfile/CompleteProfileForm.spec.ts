import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import CompleteProfileForm from './CompleteProfileForm.vue';

const mockUpdateProfile = vi.fn();
const mockAuthenticate = vi.fn();
const mockSignout = vi.fn();
const mockRouterPush = vi.fn();
const mockAddToast = vi.fn();
const mockValidateForm = vi.fn();
const mockResetFormState = vi.fn();
const mockFormState = ref({
	form: { name: '', surname: '' },
	errors: [] as { field: string; message: string }[],
	displayErrors: false
});

vi.stubGlobal('useNuxtApp', () => ({
	$api: { profile: { update: mockUpdateProfile } },
	$auth: { authenticate: mockAuthenticate, signout: mockSignout },
	$router: { push: mockRouterPush }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useCompleteProfileForm', () => ({
	formState: mockFormState,
	checkError: () => '',
	resetFormState: mockResetFormState,
	validateForm: mockValidateForm
}));

const mountForm = () =>
	mount(CompleteProfileForm, {
		global: {
			stubs: {
				AuthPageHeader: true,
				AuthPrompt: { props: ['message'], template: '<p><slot /></p>' },
				Button: {
					props: ['type', 'disabled'],
					template: '<button :type="type" :disabled="disabled"><slot /></button>'
				},
				InputWrapper: { template: '<div><slot name="label" /><slot /></div>' },
				Label: { template: '<label><slot /></label>' },
				InputText: { template: '<input />' },
				ErrorMessage: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

const submit = async (wrapper: ReturnType<typeof mountForm>) => {
	await wrapper.find('form').trigger('submit');
	await flushPromises();
};

describe('CompleteProfileForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFormState.value = {
			form: { name: 'Juan', surname: 'Lessa' },
			errors: [],
			displayErrors: false
		};
		mockUpdateProfile.mockResolvedValue(undefined);
		mockAuthenticate.mockResolvedValue(true);
	});

	it('updates the profile, reloads the session and navigates home', async () => {
		const wrapper = mountForm();

		await submit(wrapper);

		expect(mockUpdateProfile).toHaveBeenCalledWith({ name: 'Juan', surname: 'Lessa' });
		expect(mockAuthenticate).toHaveBeenCalled();
		expect(mockRouterPush).toHaveBeenCalledWith('/');
	});

	it('does not submit when validation fails', async () => {
		mockFormState.value.errors = [{ field: 'name', message: 'errors.users.name' }];
		const wrapper = mountForm();

		await submit(wrapper);

		expect(mockUpdateProfile).not.toHaveBeenCalled();
	});

	it('shows an error toast when the update fails', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		mockUpdateProfile.mockRejectedValue(new Error('network'));
		const wrapper = mountForm();

		await submit(wrapper);

		expect(mockRouterPush).not.toHaveBeenCalled();
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});

	it('signs out and goes to the signin page', async () => {
		mockSignout.mockResolvedValue(undefined);
		const wrapper = mountForm();

		await wrapper.find('p button').trigger('click');
		await flushPromises();

		expect(mockSignout).toHaveBeenCalled();
		expect(mockRouterPush).toHaveBeenCalledWith('/signin');
	});
});
