import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineAbilityForUser } from '~/domain/accessControl';
import type { AppAbility } from '~/domain/accessControl/accessControl.types';
import type { User } from '~/domain/user/user.entity';
import { reactive, ref, shallowRef } from 'vue';
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

const nuxtApp = { isHydrating: false };
vi.stubGlobal('useNuxtApp', () => ({
	...nuxtApp,
	$auth: { state: authState, signout: mockSignout }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast: vi.fn() }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
// Set to check the links against the real permissions of a role instead of the `allowed` list.
const realAbility = shallowRef<AppAbility | undefined>(undefined);
vi.stubGlobal('useAppAbility', () => ({
	can: (...args: Parameters<AppAbility['can']>) =>
		realAbility.value
			? realAbility.value.can(...args)
			: allowed.value.includes(args[1] as string)
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
const publicNavs = (wrapper: ReturnType<typeof mountTopBar>) =>
	wrapper.findAll('nav[aria-label="organisms.topBar.publicNav.label"]');

describe('TopBar', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		route.path = '/';
		authState.value = { isAuthenticated: true, user };
		realAbility.value = undefined;
		allowed.value = ['Drink', 'Category', 'Unit', 'Ingredient', 'User'];
		mockSignout.mockResolvedValue(undefined);
	});

	it('lists the management links in order, starting with drinks', () => {
		const links = desktopNav(mountTopBar())
			.findAll('a')
			.map((link) => link.attributes('href'));

		expect(links).toEqual(['/drinks', '/ingredients', '/categories', '/units', '/users']);
	});

	it('divides the catalog from the administration in the desktop bar', () => {
		const nav = desktopNav(mountTopBar());
		const children = nav.element.children;
		const divider = nav.find('[data-testid="manage-group-divider"]');

		expect(divider.exists()).toBe(true);
		expect(divider.attributes('aria-hidden')).toBe('true');
		// Right between the last catalog area and the administration.
		const index = Array.from(children).indexOf(divider.element);
		expect(children[index - 1]?.getAttribute('href')).toBe('/units');
		expect(children[index + 1]?.getAttribute('href')).toBe('/users');
	});

	it('puts users in an administration section of the mobile menu', () => {
		const menu = mobileMenu(mountTopBar());
		const sections = menu.findAll('nav[aria-labelledby]');
		const manage = sections.find((nav) =>
			nav.text().includes('organisms.topBar.manageSection')
		);
		const admin = sections.find((nav) => nav.text().includes('organisms.topBar.adminSection'));

		expect(manage?.findAll('a').map((link) => link.attributes('href'))).toEqual([
			'/drinks',
			'/ingredients',
			'/categories',
			'/units'
		]);
		expect(admin?.findAll('a').map((link) => link.attributes('href'))).toEqual(['/users']);
	});

	it('has no divider nor administration section without access to the users', () => {
		allowed.value = ['Drink', 'Category', 'Unit', 'Ingredient'];
		const wrapper = mountTopBar();

		expect(wrapper.find('[data-testid="manage-group-divider"]').exists()).toBe(false);
		expect(mobileMenu(wrapper).text()).not.toContain('organisms.topBar.adminSection');
	});

	it.each([
		{ title: 'members', isAuthenticated: true },
		{ title: 'guests', isAuthenticated: false }
	])(
		'offers the public pages to $title, on desktop and in the mobile menu',
		({ isAuthenticated }) => {
			authState.value = isAuthenticated ? { isAuthenticated, user } : { isAuthenticated };
			allowed.value = [];
			const navs = publicNavs(mountTopBar());

			expect(navs).toHaveLength(2);
			for (const nav of navs) {
				expect(nav.findAll('a').map((link) => link.attributes('href'))).toEqual(['/bar']);
				expect(nav.text()).toBe('organisms.topBar.myBar');
			}
		}
	);

	it('marks the bar as the current page when it is open', () => {
		route.path = '/bar';
		const wrapper = mountTopBar();

		expect(wrapper.findAll('[aria-current="page"]').map((item) => item.text())).toEqual([
			'organisms.topBar.myBar',
			'organisms.topBar.myBar'
		]);
		expect(wrapper.find('a[href="/bar"]').exists()).toBe(false);
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

	// The links use the same check as the guards of their pages, so each role sees exactly the areas it can open.
	it.each([
		['owner', ['/drinks', '/ingredients', '/categories', '/units', '/users']],
		['admin', ['/drinks', '/ingredients', '/categories', '/units', '/users']],
		['partner', ['/drinks', '/ingredients', '/categories', '/units']],
		['member', []]
	] as const)('shows the %s the management areas of its role', (role, paths) => {
		realAbility.value = defineAbilityForUser({ ...user, id: 'user-1', role } as User);
		const wrapper = mountTopBar();
		const nav = desktopNav(wrapper);

		expect(nav.exists() ? nav.findAll('a').map((link) => link.attributes('href')) : []).toEqual(
			paths
		);
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

	it('keeps the account area neutral while hydrating, then shows the session', async () => {
		nuxtApp.isHydrating = true;
		const wrapper = mountTopBar();

		// Same markup as the server-rendered guest page: no sign-in, no avatar, no user menu.
		expect(wrapper.find('a[href="/signin"]').exists()).toBe(false);
		expect(wrapper.find('a[href="/profile"]').exists()).toBe(false);
		expect(wrapper.findComponent(UserMenuStub).exists()).toBe(false);

		await flushPromises();

		expect(wrapper.findComponent(UserMenuStub).exists()).toBe(true);
		expect(wrapper.find('a[href="/signin"]').exists()).toBe(false);
		nuxtApp.isHydrating = false;
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
