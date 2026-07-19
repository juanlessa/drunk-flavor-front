import type { DrinkForm } from '~/types/drink.types';

export const initEmptyDrinkForm = (): DrinkForm => ({
	translations: {
		en: { name: '', method: '' },
		pt: { name: '', method: '' }
	},
	ingredients: []
});
