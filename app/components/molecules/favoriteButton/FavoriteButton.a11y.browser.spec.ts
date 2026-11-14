import { afterAll, describe, it } from 'vitest';
import type { FavoritesState } from '~/types/favorite.types';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import FavoriteButton from './FavoriteButton.vue';
// Fills the state the hearts share, which is a `useState` and so can be set without a component.
const setFavorites = (ids: string[]) => {
	useState<FavoritesState>('favorites').value = { ids, status: 'ready', pendingIds: [] };
};
afterAll(() => {
	applyTheme('light');
	setFavorites([]);
});
// The `media` variant sits on a photo, whose colors axe cannot measure, so it has no contrast audit here.
describe.each(THEMES)('FavoriteButton accessibility in the %s theme', (theme) => {
	it.each([
		{ variant: 'chip', isFavorite: false },
		{ variant: 'chip', isFavorite: true },
		{ variant: 'pill', isFavorite: false },
		{ variant: 'pill', isFavorite: true }
	] as const)(
		'has no violations for the $variant variant when favorite is $isFavorite',
		async ({ variant, isFavorite }) => {
			setFavorites(isFavorite ? ['mojito'] : []);
			await auditInBrowser(FavoriteButton, theme, {
				props: { drinkId: 'mojito', drinkName: 'Mojito', variant }
			});
		}
	);
});
