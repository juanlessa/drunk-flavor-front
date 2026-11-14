import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import FavoriteButton from './FavoriteButton.vue';
const favoriteIds = ref<string[]>([]);
const pendingIds = ref<string[]>([]);
const toggle = vi.fn();
vi.stubGlobal('useFavorites', () => ({
	isFavorite: (id: string) => favoriteIds.value.includes(id),
	isPending: (id: string) => pendingIds.value.includes(id),
	toggle
}));
const mountButton = (props: Record<string, unknown> = {}) =>
	mount(FavoriteButton, {
		props: { drinkId: 'mojito', drinkName: 'Mojito', ...props },
		global: {
			mocks: {
				$t: (key: string, params?: Record<string, unknown>) =>
					params ? `${key} ${JSON.stringify(params)}` : key
			}
		}
	});
describe('FavoriteButton', () => {
	beforeEach(() => {
		favoriteIds.value = [];
		pendingIds.value = [];
		toggle.mockReset();
	});
	it('is a toggle button that is not pressed for a drink that is not a favorite', () => {
		const button = mountButton().get('button');
		expect(button.attributes('aria-pressed')).toBe('false');
		expect(button.find('svg').attributes('fill')).toBe('none');
	});
	it('is pressed, with a filled heart, for a favorite', () => {
		favoriteIds.value = ['mojito'];
		const button = mountButton().get('button');
		expect(button.attributes('aria-pressed')).toBe('true');
		expect(button.find('svg').attributes('fill')).toBe('currentColor');
	});
	it('keeps the same name in both states, and names the drink', async () => {
		const wrapper = mountButton();
		const name = wrapper.get('button').attributes('aria-label');
		expect(name).toBe('molecules.favoriteButton.ariaLabel {"name":"Mojito"}');
		favoriteIds.value = ['mojito'];
		await wrapper.vm.$nextTick();
		expect(wrapper.get('button').attributes('aria-label')).toBe(name);
	});
	it('asks to toggle its own drink when it is tapped', async () => {
		await mountButton().get('button').trigger('click');
		expect(toggle).toHaveBeenCalledWith('mojito');
	});
	it('ignores a tap while its request is on its way, and stays focusable', async () => {
		pendingIds.value = ['mojito'];
		const button = mountButton().get('button');
		expect(button.attributes('aria-disabled')).toBe('true');
		expect(button.attributes('disabled')).toBeUndefined();
		await button.trigger('click');
		expect(toggle).not.toHaveBeenCalled();
	});
	it('only the pill shows a visible label', () => {
		expect(mountButton().text()).toBe('');
		expect(mountButton({ variant: 'media' }).text()).toBe('');
		expect(mountButton({ variant: 'pill' }).text()).toBe('molecules.favoriteButton.label');
	});
});
