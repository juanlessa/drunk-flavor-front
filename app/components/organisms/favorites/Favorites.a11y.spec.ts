import { mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import FavoritesEmpty from './FavoritesEmpty.vue';
import FavoritesSignedOut from './FavoritesSignedOut.vue';
vi.stubGlobal('navigateTo', vi.fn());
vi.stubGlobal('useRoute', () => ({ fullPath: '/favorites' }));
vi.stubGlobal('useLocalePath', () => (path: string) => path);
const global = {
	stubs: {
		Button: { template: '<button type="button"><slot /></button>' },
		Anchor: { template: '<a href="/"><slot /></a>' }
	},
	mocks: { $t: (key: string) => key }
};
describe('Favorites panels accessibility', () => {
	it.each([
		['signed out', FavoritesSignedOut],
		['empty', FavoritesEmpty]
	])('has no violations when %s', async (_, component) => {
		const wrapper = mount(component, { attachTo: document.body, global });
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
