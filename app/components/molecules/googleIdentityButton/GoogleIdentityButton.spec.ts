import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import GoogleIdentityButton from './GoogleIdentityButton.vue';
import type { GoogleCredentialResponse, GoogleIdConfiguration } from '~/types/googleIdentity.types';

const initialize = vi.fn();
const renderButton = vi.fn();
const loadScript = vi.fn();
const isDark = ref(false);
const locale = ref('en');
const runtimeConfig = { public: { googleClientId: 'client-id' } };

vi.mock('vue-i18n', () => ({ useI18n: () => ({ locale }) }));
vi.mock('~/helpers/loadGoogleIdentityScript', () => ({
	loadGoogleIdentityScript: (language: string) => loadScript(language)
}));
vi.stubGlobal('useRuntimeConfig', () => runtimeConfig);
vi.stubGlobal('useNuxtApp', () => ({ $theme: { isDark } }));
vi.stubGlobal('useI18n', () => ({ locale }));

const mountButton = async () => {
	const wrapper = mount(GoogleIdentityButton);
	await flushPromises();
	return wrapper;
};

describe('GoogleIdentityButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		runtimeConfig.public.googleClientId = 'client-id';
		locale.value = 'en';
		isDark.value = false;
		loadScript.mockResolvedValue({ initialize, renderButton });
	});

	it('initializes GIS and reports availability', async () => {
		const wrapper = await mountButton();

		expect(loadScript).toHaveBeenCalledWith('en');
		expect(initialize).toHaveBeenCalledWith(
			expect.objectContaining({ client_id: 'client-id', context: 'use' })
		);
		expect(wrapper.emitted('available')).toEqual([[true]]);
	});

	it('emits the verified credential without choosing an API purpose', async () => {
		const wrapper = await mountButton();
		const config = initialize.mock.calls[0]?.[0] as GoogleIdConfiguration;

		config.callback({ credential: 'id-token' } as GoogleCredentialResponse);

		expect(wrapper.emitted('credential')).toEqual([['id-token']]);
	});

	it('renders nothing and reports unavailable without a client id', async () => {
		runtimeConfig.public.googleClientId = '';
		const wrapper = await mountButton();

		expect(wrapper.find('[data-testid="google-identity-button"]').exists()).toBe(false);
		expect(wrapper.emitted('available')).toEqual([[false]]);
	});

	it('uses the Portuguese Google locale', async () => {
		locale.value = 'pt';
		await mountButton();

		expect(loadScript).toHaveBeenCalledWith('pt_BR');
	});
});
