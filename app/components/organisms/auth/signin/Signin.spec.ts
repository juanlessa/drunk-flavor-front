import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Signin from './Signin.vue';

const mockAuthenticate = vi.fn();
const mockRouterPush = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$auth: { authenticate: mockAuthenticate },
	$router: { push: mockRouterPush }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));

const CredentialsSignInStub = {
	name: 'CredentialsSignIn',
	template: '<div data-testid="credentials-signin" />',
	emits: ['success', 'error']
};
const GoogleSignInStub = {
	name: 'GoogleSignIn',
	template: '<div data-testid="google-signin" />',
	emits: ['available', 'success', 'error']
};
const SeparatorStub = { template: '<hr data-testid="separator" />' };

const mountSignin = () =>
	mount(Signin, {
		global: {
			stubs: {
				CredentialsSignIn: CredentialsSignInStub,
				GoogleSignIn: GoogleSignInStub,
				Separator: SeparatorStub,
				ClientOnly: { template: '<div><slot /></div>' },
				Box: { template: '<div><slot /></div>' },
				Heading: { template: '<h1><slot /></h1>' },
				Text: { template: '<span><slot /></span>' },
				Anchor: { template: '<a><slot /></a>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('Signin', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthenticate.mockResolvedValue(true);
	});

	it('renders every sign-in method', () => {
		const wrapper = mountSignin();

		expect(wrapper.find('[data-testid="credentials-signin"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="google-signin"]').exists()).toBe(true);
	});

	it('hides the providers divider until a provider reports it is available', async () => {
		const wrapper = mountSignin();
		expect(wrapper.find('[data-testid="separator"]').exists()).toBe(false);

		await wrapper.findComponent(GoogleSignInStub).vm.$emit('available', true);

		expect(wrapper.findAll('[data-testid="separator"]')).toHaveLength(2);
	});

	it.each([
		['credentials', CredentialsSignInStub],
		['google', GoogleSignInStub]
	])('loads the profile and navigates home when %s sign-in succeeds', async (_, stub) => {
		const wrapper = mountSignin();

		await wrapper.findComponent(stub).vm.$emit('success');
		await flushPromises();

		expect(mockAuthenticate).toHaveBeenCalled();
		expect(mockRouterPush).toHaveBeenCalledWith('/');
	});

	it('shows the error message emitted by a sign-in method', async () => {
		const wrapper = mountSignin();

		await wrapper.findComponent(GoogleSignInStub).vm.$emit('error', 'failed');

		expect(mockAddToast).toHaveBeenCalledWith({
			type: 'error',
			title: 'organisms.signin.error.title',
			message: 'failed'
		});
		expect(mockRouterPush).not.toHaveBeenCalled();
	});
});
