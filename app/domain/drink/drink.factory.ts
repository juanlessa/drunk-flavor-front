import type { Drink } from './drink.entity';

export const initEmptyDrink = (): Drink => ({
	id: '',
	translations: {
		en: { name: '', method: '' },
		pt: { name: '', method: '' }
	},
	ingredients: [],
	cover: undefined,
	thumbnail: undefined,
	avgRating: 0,
	ratingsCount: 0,
	createdAt: new Date(),
	updatedAt: new Date()
});
