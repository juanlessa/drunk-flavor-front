import { mount, flushPromises, enableAutoUnmount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import GoogleSignIn from './GoogleSignIn.vue';
import type { GoogleCredentialResponse, GoogleIdConfiguration } from '~/types/googleIdentity.types';

const mockInitialize = vi.fn();
const mockRenderButton = vi.fn();
const mockLoadScript = vi.fn();
const mockGoogleAuth = vi.fn();
const mockIsDark = ref(false);
const mockLocale = ref('en');
const mockRuntimeConfig = { public: { googleClientId: 'client-id.apps.googleusercontent.com' } };

vi.mock('~/helpers/loadGoogleIdentityScript', () => ({
	loadGoogleIdentityScript: (language: string) => mockLoadScript(language)
}));

vi.stubGlobal('useRuntimeConfig', () => mockRuntimeConfig);
vi.stubGlobal('useNuxtApp', () => ({
	$api: { auth: { googleAuth: mockGoogleAuth } },
	$theme: { isDark: mockIsDark }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: mockLocale }));

const globalStubs = {
	Box: { template: '<div><slot /></div>' },
	Text: { template: '<span><slot /></span>' }
};

const mountGoogleSignIn = async () => {
	const wrapper = mount(GoogleSignIn, {
		global: { stubs: globalStubs, mocks: { $t: (key: string) => key } }
	});
	await flushPromises();
	return wrapper;
};

const getCredentialCallback = () => {
	const config = mockInitialize.mock.calls[0]?.[0] as GoogleIdConfiguration;
	return config.callback as (response: GoogleCredentialResponse) => Promise<void>;
};

// Unmount after each test so earlier instances stop watching the shared locale mock.
enableAutoUnmount(afterEach);

describe('GoogleSignIn', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockRuntimeConfig.public.googleClientId = 'client-id.apps.googleusercontent.com';
		mockIsDark.value = false;
		mockLocale.value = 'en';
		mockLoadScript.mockResolvedValue({
			initialize: mockInitialize,
			renderButton: mockRenderButton
		});
		mockGoogleAuth.mockResolvedValue(undefined);
	});

	it('renders nothing when no client id is configured', async () => {
		mockRuntimeConfig.public.googleClientId = '';
		const wrapper = await mountGoogleSignIn();

		expect(wrapper.find('[data-testid="google-signin-button"]').exists()).toBe(false);
		expect(mockLoadScript).not.toHaveBeenCalled();
	});

	it('hides itself when the Google script fails to load', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		mockLoadScript.mockRejectedValue(new Error('blocked'));
		const wrapper = await mountGoogleSignIn();

		expect(wrapper.find('[data-testid="google-signin-button"]').exists()).toBe(false);
	});

	it('loads the Google library in the current app language', async () => {
		mockLocale.value = 'pt';
		await mountGoogleSignIn();

		expect(mockLoadScript).toHaveBeenCalledWith('pt_BR');
	});

	it('reloads the library and re-renders the button when the app language changes', async () => {
		await mountGoogleSignIn();
		expect(mockLoadScript).toHaveBeenLastCalledWith('en');

		mockLocale.value = 'pt';
		await flushPromises();

		expect(mockLoadScript).toHaveBeenLastCalledWith('pt_BR');
		// The reloaded library must be initialized again before the button is re-rendered.
		expect(mockInitialize).toHaveBeenCalledTimes(2);
	});

	it('initializes GIS with the client id and the FedCM button flow', async () => {
		await mountGoogleSignIn();

		expect(mockInitialize).toHaveBeenCalledWith(
			expect.objectContaining({
				client_id: 'client-id.apps.googleusercontent.com',
				ux_mode: 'popup',
				use_fedcm_for_button: true
			})
		);
	});

	it('reports availability once the button can be shown', async () => {
		const wrapper = await mountGoogleSignIn();

		expect(wrapper.emitted('available')).toEqual([[true]]);
	});

	it('reports it is unavailable when the script fails to load', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		mockLoadScript.mockRejectedValue(new Error('blocked'));
		const wrapper = await mountGoogleSignIn();

		expect(wrapper.emitted('available')).toEqual([[false]]);
	});

	it('posts the credential and emits success', async () => {
		const wrapper = await mountGoogleSignIn();

		await getCredentialCallback()({ credential: 'google-id-token' });

		expect(mockGoogleAuth).toHaveBeenCalledWith({ idToken: 'google-id-token' });
		expect(wrapper.emitted('success')).toHaveLength(1);
		expect(wrapper.emitted('error')).toBeUndefined();
	});

	it('emits the email-not-verified message when the backend rejects an unverified email', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		mockGoogleAuth.mockRejectedValue({
			data: { localeKey: 'apiResponses.auth.googleEmailNotVerified' }
		});
		const wrapper = await mountGoogleSignIn();

		await getCredentialCallback()({ credential: 'google-id-token' });

		expect(wrapper.emitted('success')).toBeUndefined();
		expect(wrapper.emitted('error')).toEqual([
			['organisms.googleSignIn.error.emailNotVerified']
		]);
	});

	it('emits a generic error message for other failures', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		mockGoogleAuth.mockRejectedValue(new Error('network'));
		const wrapper = await mountGoogleSignIn();

		await getCredentialCallback()({ credential: 'google-id-token' });

		expect(wrapper.emitted('error')).toEqual([['organisms.googleSignIn.error.message']]);
	});
});
