import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import GoogleIdentityButton from './GoogleIdentityButton.vue';
import type { GoogleCredentialResponse, GoogleIdConfiguration } from '~/types/googleIdentity.types';

const initialize = vi.fn();
const renderButton = vi.fn();
const loadScript = vi.fn();
const locale = ref('en');
const t = (key: string) => key;
const runtimeConfig = { public: { googleClientId: 'client-id' } };

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t, locale }) }));
vi.mock('~/helpers/loadGoogleIdentityScript', () => ({
	loadGoogleIdentityScript: (language: string) => loadScript(language)
}));
vi.stubGlobal('useRuntimeConfig', () => runtimeConfig);

const mountButton = async (props = {}) => {
	const wrapper = mount(GoogleIdentityButton, {
		props,
		global: { stubs: { GoogleIcon: true } }
	});
	await flushPromises();
	return wrapper;
};

const findFace = (wrapper: Awaited<ReturnType<typeof mountButton>>) =>
	wrapper.find('[aria-hidden="true"]');

// happy-dom has no layout, so give the container the width it would have in the page.
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
	configurable: true,
	get: () => 320
});

describe('GoogleIdentityButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		runtimeConfig.public.googleClientId = 'client-id';
		locale.value = 'en';
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

	it('renders the Google button invisibly on top of the design-system face', async () => {
		const wrapper = await mountButton();
		const googleLayer = wrapper.find('[data-testid="google-identity-button"]');

		expect(renderButton).toHaveBeenCalledWith(
			googleLayer.element,
			expect.objectContaining({ theme: 'outline', size: 'large', text: 'continue_with' })
		);
		expect(googleLayer.classes()).toEqual(
			expect.arrayContaining(['absolute', 'inset-0', 'opacity-0'])
		);
	});

	it('shows the localized label on a face hidden from assistive technology', async () => {
		const wrapper = await mountButton({ text: 'signin_with' });
		const face = findFace(wrapper);

		expect(face.text()).toBe('molecules.googleIdentityButton.text.signin_with');
		expect(face.classes()).not.toContain('opacity-disabled');
	});

	it('dims the face while the Google button is not rendered yet', async () => {
		loadScript.mockReturnValue(new Promise(() => {}));
		const wrapper = await mountButton();

		expect(findFace(wrapper).classes()).toContain('opacity-disabled');
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
