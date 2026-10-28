import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import TopBar from './TopBar.vue';

const authState = ref({ isAuthenticated: true, user: undefined });
vi.stubGlobal('useNuxtApp', () => ({
	$auth: { state: authState, signout: vi.fn() }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast: vi.fn() }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useAppAbility', () => ({ can: () => true }));
vi.stubGlobal('navigateTo', vi.fn());

const mountTopBar = () =>
	mount(TopBar, {
		global: {
			stubs: {
				Box: {
					props: ['as'],
					template: '<component :is="as || \'div\'"><slot /></component>'
				},
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Image: true,
				Text: { template: '<span><slot /></span>' },
				Button: { template: '<button><slot /></button>' },
				LanguageSwitcher: true,
				ThemeSwitcher: true,
				HamburgerMenu: { template: '<div><slot /></div>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('TopBar', () => {
	it('shows the profile destination in desktop and mobile navigation when authenticated', () => {
		const wrapper = mountTopBar();
		const profileLinks = wrapper.findAll('a[href="/profile"]');

		expect(profileLinks).toHaveLength(2);
		expect(profileLinks.every((link) => link.text().includes('organisms.topBar.profile'))).toBe(
			true
		);
	});
});
