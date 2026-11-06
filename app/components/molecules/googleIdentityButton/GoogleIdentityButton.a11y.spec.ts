import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, it, vi } from 'vitest';
import { ref } from 'vue';
import { expectNoA11yViolations } from '~/test/axe';
import GoogleIcon from '~/components/icons/GoogleIcon.vue';
import GoogleIdentityButton from './GoogleIdentityButton.vue';

const t = (key: string) => key;
const locale = ref('en');

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t, locale }) }));
vi.mock('~/helpers/loadGoogleIdentityScript', () => ({
	loadGoogleIdentityScript: () =>
		Promise.resolve({ initCodeClient: () => ({ requestCode: () => {} }) })
}));
vi.stubGlobal('useRuntimeConfig', () => ({ public: { googleClientId: 'client-id' } }));

enableAutoUnmount(afterEach);

describe('GoogleIdentityButton accessibility', () => {
	it.each<{ block?: boolean; disabled?: boolean; text?: 'signin_with' }>([
		{},
		{ block: true },
		{ disabled: true },
		{ text: 'signin_with' }
	])('has no violations with props %o', async (props) => {
		const wrapper = mount(GoogleIdentityButton, {
			props,
			global: { components: { GoogleIcon } },
			attachTo: document.body
		});
		await flushPromises();

		await expectNoA11yViolations(wrapper.element);
	});
});
