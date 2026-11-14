import { mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import FavoriteButton from './FavoriteButton.vue';
const favorites = new Set<string>();
vi.stubGlobal('useFavorites', () => ({
	isFavorite: (id: string) => favorites.has(id),
	isPending: () => false,
	toggle: vi.fn()
}));
describe('FavoriteButton accessibility', () => {
	it.each([
		{ variant: 'chip', isFavorite: false },
		{ variant: 'chip', isFavorite: true },
		{ variant: 'media', isFavorite: false },
		{ variant: 'media', isFavorite: true },
		{ variant: 'pill', isFavorite: false },
		{ variant: 'pill', isFavorite: true }
	])('has no violations for the $variant variant when favorite is $isFavorite', async (props) => {
		favorites.clear();
		if (props.isFavorite) favorites.add('mojito');
		const wrapper = mount(FavoriteButton, {
			props: { drinkId: 'mojito', drinkName: 'Mojito', variant: props.variant as 'chip' },
			attachTo: document.body,
			global: { mocks: { $t: (key: string) => key } }
		});
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
