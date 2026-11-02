import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive, ref } from 'vue';
import TopBar from './TopBar.vue';

const user = {
	id: 'user-1',
	name: 'Juan',
	surname: 'Lessa',
	email: 'juan@example.com',
	role: 'admin'
};
const authState = ref<{ isAuthenticated: boolean; user?: typeof user }>({
	isAuthenticated: true,
	user
});
const mockSignout = vi.fn();
const mockNavigateTo = vi.fn();
const allowed = ref<string[]>(['Drink', 'Category', 'Unit', 'Ingredient', 'User']);

vi.stubGlobal('useNuxtApp', () => ({ $auth: { state: authState, signout: mockSignout } }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast: vi.fn() }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useAppAbility', () => ({
	can: (_action: string, subject: string) => allowed.value.includes(subject)
}));
vi.stubGlobal('navigateTo', mockNavigateTo);
const route = reactive({ path: '/' });
vi.stubGlobal('useRoute', () => route);

const UserMenuStub = {
	name: 'UserMenu',
	props: ['user', 'isSigningOut'],
	emits: ['signout'],
	template: '<div data-testid="user-menu" />'
};
const HamburgerStub = {
	name: 'HamburgerMenu',
	props: ['open', 'title', 'openLabel', 'closeLabel'],
	emits: ['update:open'],
	template: '<div data-testid="mobile-menu" :data-open="String(open)"><slot /></div>'
};

const mountTopBar = () =>
	mount(TopBar, {
		global: {
			stubs: {
				Box: {
					props: ['as'],
					template: '<component :is="as || \'div\'"><slot /></component>'
				},
				NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Avatar: true,
				LanguageSwitcher: true,
				ThemeSwitcher: true,
				UserMenu: UserMenuStub,
				HamburgerMenu: HamburgerStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

const desktopNav = (wrapper: ReturnType<typeof mountTopBar>) =>
	wrapper.find('nav[aria-label="organisms.topBar.primaryNav.label"]');
const mobileMenu = (wrapper: ReturnType<typeof mountTopBar>) =>
	wrapper.find('[data-testid="mobile-menu"]');

describe('TopBar', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		route.path = '/';
		authState.value = { isAuthenticated: true, user };
		allowed.value = ['Drink', 'Category', 'Unit', 'Ingredient', 'User'];
		mockSignout.mockResolvedValue(undefined);
	});

	it('lists the management links in order, starting with drinks', () => {
		const links = desktopNav(mountTopBar())
			.findAll('a')
			.map((link) => link.attributes('href'));

		expect(links).toEqual(['/drinks', '/categories', '/units', '/ingredients', '/users']);
	});

	it('marks the current page without a link in the desktop and mobile navigation', () => {
		route.path = '/ingredients';
		const wrapper = mountTopBar();
		const current = wrapper.findAll('[aria-current="page"]');

		expect(current).toHaveLength(2);
		expect(current.every((item) => item.element.tagName === 'SPAN')).toBe(true);
		expect(current.every((item) => item.text() === 'organisms.topBar.ingredients')).toBe(true);
		expect(wrapper.find('a[href="/ingredients"]').exists()).toBe(false);
	});

	it('keeps the section link usable on a nested page', () => {
		route.path = '/users/user-1';
		const wrapper = mountTopBar();

		expect(wrapper.find('[aria-current="page"]').exists()).toBe(false);
		expect(wrapper.findAll('a[href="/users"]')).toHaveLength(2);
	});

	it('only shows the management areas the user can manage', () => {
		allowed.value = ['Drink'];
		const wrapper = mountTopBar();

		expect(
			desktopNav(wrapper)
				.findAll('a')
				.map((link) => link.attributes('href'))
		).toEqual(['/drinks']);
	});

	it('hides the management navigation for members', () => {
		allowed.value = [];
		const wrapper = mountTopBar();

		expect(desktopNav(wrapper).exists()).toBe(false);
		expect(mobileMenu(wrapper).text()).not.toContain('organisms.topBar.manageSection');
	});

	it('moves profile and sign-out into the account menus when authenticated', () => {
		const wrapper = mountTopBar();

		expect(wrapper.findComponent(UserMenuStub).props('user')).toEqual(user);
		expect(desktopNav(wrapper).find('a[href="/profile"]').exists()).toBe(false);
		// The avatar shortcut in the bar and the profile entry in the mobile menu.
		expect(wrapper.findAll('a[href="/profile"]')).toHaveLength(2);
		expect(mobileMenu(wrapper).text()).toContain('organisms.topBar.logout');
	});

	it('signs out from the user menu and goes home', async () => {
		const wrapper = mountTopBar();

		wrapper.findComponent(UserMenuStub).vm.$emit('signout');
		await flushPromises();

		expect(mockSignout).toHaveBeenCalled();
		expect(mockNavigateTo).toHaveBeenCalledWith('/');
	});

	it('shows only the sign-in action to guests', () => {
		authState.value = { isAuthenticated: false, user: undefined };
		const wrapper = mountTopBar();

		expect(wrapper.findComponent(UserMenuStub).exists()).toBe(false);
		expect(desktopNav(wrapper).exists()).toBe(false);
		expect(wrapper.findAll('a[href="/signin"]').length).toBeGreaterThanOrEqual(2);
		expect(wrapper.find('a[href="/profile"]').exists()).toBe(false);
	});

	it('closes the mobile menu after navigating', async () => {
		const wrapper = mountTopBar();
		wrapper.findComponent(HamburgerStub).vm.$emit('update:open', true);
		await flushPromises();
		expect(mobileMenu(wrapper).attributes('data-open')).toBe('true');

		route.path = '/drinks';
		await flushPromises();

		expect(mobileMenu(wrapper).attributes('data-open')).toBe('false');
	});
});
