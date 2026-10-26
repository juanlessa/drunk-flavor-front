import type { Drink } from './drink.entity';

export const initEmptyDrink = (): Drink => ({
	_id: '',
	translations: {
		en: { name: '', method: '' },
		pt: { name: '', method: '' }
	},
	ingredients: [],
	cover: undefined,
	thumbnail: undefined,
	avg_rating: 0,
	ratings_count: 0,
	created_at: new Date(),
	updated_at: new Date()
});
