import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GoogleSignIn from './GoogleSignIn.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
const googleAuth = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({ $api: { auth: { googleAuth } } }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));

const GoogleIdentityButtonStub = {
	name: 'GoogleIdentityButton',
	emits: ['code', 'available', 'error'],
	template:
		'<button data-testid="google" @click="$emit(\'code\', \'authorization-code\')">Google</button>'
};
const mountSignIn = () =>
	mount(GoogleSignIn, {
		global: {
			stubs: { GoogleIdentityButton: GoogleIdentityButtonStub },
			mocks: { $t: (key: string) => key }
		}
	});

describe('GoogleSignIn', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		googleAuth.mockResolvedValue(undefined);
	});

	it('posts the authorization code emitted by the generic identity button', async () => {
		const wrapper = mountSignIn();
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(googleAuth).toHaveBeenCalledWith({ code: 'authorization-code' });
		expect(wrapper.emitted('success')).toHaveLength(1);
	});

	it('maps an unverified-email response to its specific message', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		googleAuth.mockRejectedValue({
			data: { code: 'GOOGLE_EMAIL_NOT_VERIFIED' }
		});
		const wrapper = mountSignIn();
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(wrapper.emitted('error')).toEqual([
			['organisms.googleSignIn.error.emailNotVerified']
		]);
	});

	it('maps an existing-account response to the profile-linking guidance', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		googleAuth.mockRejectedValue({
			data: { code: 'ACCOUNT_LINK_REQUIRED' }
		});
		const wrapper = mountSignIn();
		await wrapper.find('[data-testid="google"]').trigger('click');
		await flushPromises();

		expect(wrapper.emitted('error')).toEqual([
			['organisms.googleSignIn.error.accountLinkRequired']
		]);
	});

	it('forwards availability from the generic identity button', () => {
		const wrapper = mountSignIn();
		wrapper.findComponent(GoogleIdentityButtonStub).vm.$emit('available', true);

		expect(wrapper.emitted('available')).toEqual([[true]]);
	});
});
