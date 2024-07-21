import type { Drink, DrinkForm } from '~/types/drink';

export const initEmptyDrink = (): Drink => ({
	_id: '',
	translations: {
		en: { name: '', method: '' },
		pt: { name: '', method: '' }
	},
	ingredients: [],
	cover: '',
	thumbnail: '',
	created_at: new Date(),
	updated_at: new Date()
});

export const initEmptyDrinkForm = (): DrinkForm => ({
	translations: {
		en: { name: '', method: '' },
		pt: { name: '', method: '' }
	},
	ingredients: []
});
