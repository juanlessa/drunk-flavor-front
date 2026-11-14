import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import FavoritesOverview from './FavoritesOverview.vue';
const authState = ref({ isAuthenticated: false });
const isSessionKnown = ref(true);
vi.stubGlobal('useNuxtApp', () => ({ $auth: { state: authState } }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useSessionKnown', () => isSessionKnown);
const mountOverview = () =>
	mount(FavoritesOverview, {
		global: {
			stubs: {
				Anchor: { template: '<a><slot /></a>' },
				ArrowLeftIcon: true,
				FavoritesGridSkeleton: { template: '<div data-testid="skeleton" />' },
				FavoritesSignedOut: { template: '<div data-testid="signed-out" />' },
				FavoritesList: { template: '<div data-testid="list" />' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
describe('FavoritesOverview', () => {
	beforeEach(() => {
		authState.value = { isAuthenticated: false };
		isSessionKnown.value = true;
	});
	it('shows the skeleton while the session is not known, since the server cannot tell who is signed in', () => {
		isSessionKnown.value = false;
		const wrapper = mountOverview();
		expect(wrapper.find('[data-testid="skeleton"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="signed-out"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="list"]').exists()).toBe(false);
	});
	it('asks a visitor to sign in', () => {
		const wrapper = mountOverview();
		expect(wrapper.find('[data-testid="signed-out"]').exists()).toBe(true);
		expect(wrapper.find('p').text()).toBe('organisms.favorites.descriptionSignedOut');
	});
	it('lists the favorites of a signed-in person', () => {
		authState.value = { isAuthenticated: true };
		const wrapper = mountOverview();
		expect(wrapper.find('[data-testid="list"]').exists()).toBe(true);
		expect(wrapper.find('p').text()).toBe('organisms.favorites.description');
	});
});
