import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FavoritesSignedOut from './FavoritesSignedOut.vue';
const mockNavigateTo = vi.fn();
vi.stubGlobal('navigateTo', mockNavigateTo);
vi.stubGlobal('useRoute', () => ({ fullPath: '/favorites' }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
const mountPanel = () =>
	mount(FavoritesSignedOut, {
		global: {
			stubs: {
				Button: { template: '<button type="button"><slot /></button>' },
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
describe('FavoritesSignedOut', () => {
	beforeEach(() => mockNavigateTo.mockReset());
	it('asks the person to sign in and offers a way back to the drinks', () => {
		const wrapper = mountPanel();
		expect(wrapper.text()).toContain('organisms.favorites.signedOut.title');
		expect(wrapper.get('a').attributes('href')).toBe('/');
	});
	it('offers only to sign in: it does not push an account to be created', () => {
		expect(mountPanel().findAll('button')).toHaveLength(1);
	});
	it('signs in and comes back to the favorites', async () => {
		await mountPanel().get('button').trigger('click');
		expect(mockNavigateTo).toHaveBeenCalledWith({
			path: '/signin',
			query: { redirect: '/favorites' }
		});
	});
});
