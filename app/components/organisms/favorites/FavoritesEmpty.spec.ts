import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import FavoritesEmpty from './FavoritesEmpty.vue';
const mockNavigateTo = vi.fn();
vi.stubGlobal('navigateTo', mockNavigateTo);
vi.stubGlobal('useLocalePath', () => (path: string) => path);
describe('FavoritesEmpty', () => {
	it('tells the person how to save a drink and takes them to the drinks', async () => {
		const wrapper = mount(FavoritesEmpty, {
			global: {
				stubs: { Button: { template: '<button type="button"><slot /></button>' } },
				mocks: { $t: (key: string) => key }
			}
		});
		expect(wrapper.text()).toContain('organisms.favorites.empty.description');
		await wrapper.get('button').trigger('click');
		expect(mockNavigateTo).toHaveBeenCalledWith('/');
	});
});
