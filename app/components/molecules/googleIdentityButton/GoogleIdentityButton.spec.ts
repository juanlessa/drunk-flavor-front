import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import GoogleIdentityButton from './GoogleIdentityButton.vue';
import type { GoogleCodeClientConfig } from '~/types/googleIdentity.types';

const requestCode = vi.fn();
const initCodeClient = vi.fn((_config: GoogleCodeClientConfig) => ({ requestCode }));
const loadScript = vi.fn();
const locale = ref('en');
const t = (key: string) => key;
const runtimeConfig = { public: { googleClientId: 'client-id' } };

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t, locale }) }));
vi.mock('~/helpers/loadGoogleIdentityScript', () => ({
	loadGoogleIdentityScript: (language: string) => loadScript(language)
}));
vi.stubGlobal('useRuntimeConfig', () => runtimeConfig);

// Mounted buttons watch the shared `locale` ref, so each test must clean up after itself.
enableAutoUnmount(afterEach);

const mountButton = async (props = {}) => {
	const wrapper = mount(GoogleIdentityButton, {
		props,
		global: { stubs: { GoogleIcon: true } }
	});
	await flushPromises();
	return wrapper;
};

const findButton = (wrapper: Awaited<ReturnType<typeof mountButton>>) =>
	wrapper.find('[data-testid="google-identity-button"]');

const lastConfig = () => initCodeClient.mock.lastCall![0];

describe('GoogleIdentityButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		runtimeConfig.public.googleClientId = 'client-id';
		locale.value = 'en';
		loadScript.mockResolvedValue({ initCodeClient });
	});

	it('creates a popup code client for authentication-only scopes and reports availability', async () => {
		const wrapper = await mountButton();

		expect(loadScript).toHaveBeenCalledWith('en');
		expect(lastConfig()).toMatchObject({
			client_id: 'client-id',
			scope: 'openid email profile',
			ux_mode: 'popup',
			select_account: true
		});
		expect(wrapper.emitted('available')).toEqual([[true]]);
	});

	it('opens the Google popup synchronously on click', async () => {
		const wrapper = await mountButton();

		await findButton(wrapper).trigger('click');

		expect(requestCode).toHaveBeenCalledTimes(1);
	});

	it('emits the authorization code returned by the popup', async () => {
		const wrapper = await mountButton();

		lastConfig().callback({ code: 'authorization-code', scope: 'openid email profile' });

		expect(wrapper.emitted('code')).toEqual([['authorization-code']]);
		expect(wrapper.emitted('error')).toBeUndefined();
	});

	it('treats a declined consent and a closed popup as a cancel', async () => {
		const wrapper = await mountButton();

		lastConfig().callback({ error: 'access_denied' });
		lastConfig().error_callback?.({ type: 'popup_closed' });

		expect(wrapper.emitted('code')).toBeUndefined();
		expect(wrapper.emitted('error')).toBeUndefined();
	});

	it('reports OAuth errors and a popup that failed to open', async () => {
		const wrapper = await mountButton();

		lastConfig().callback({ error: 'server_error' });
		lastConfig().error_callback?.({ type: 'popup_failed_to_open' });

		expect(wrapper.emitted('error')).toHaveLength(2);
	});

	it('passes the login hint instead of forcing the account chooser', async () => {
		await mountButton({ loginHint: 'jane@example.com' });

		expect(lastConfig()).toMatchObject({ login_hint: 'jane@example.com' });
		expect(lastConfig()).not.toHaveProperty('select_account');
	});

	it('shows the localized label and stays disabled until GIS is ready', async () => {
		loadScript.mockReturnValue(new Promise(() => {}));
		const wrapper = await mountButton({ text: 'signin_with' });
		const button = findButton(wrapper);

		expect(button.text()).toBe('molecules.googleIdentityButton.text.signin_with');
		expect(button.attributes('disabled')).toBeDefined();
	});

	it('renders nothing and reports unavailable without a client id', async () => {
		runtimeConfig.public.googleClientId = '';
		const wrapper = await mountButton();

		expect(findButton(wrapper).exists()).toBe(false);
		expect(wrapper.emitted('available')).toEqual([[false]]);
	});

	it('reports unavailable when GIS fails to load', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		loadScript.mockRejectedValue(new Error('blocked'));
		const wrapper = await mountButton();

		expect(findButton(wrapper).exists()).toBe(false);
		expect(wrapper.emitted('available')).toEqual([[false]]);
		expect(wrapper.emitted('error')).toHaveLength(1);
	});

	it('reloads GIS in Portuguese and recreates the client when the locale changes', async () => {
		await mountButton();
		locale.value = 'pt';
		await flushPromises();

		expect(loadScript).toHaveBeenLastCalledWith('pt_BR');
		expect(initCodeClient).toHaveBeenCalledTimes(2);
	});
});
