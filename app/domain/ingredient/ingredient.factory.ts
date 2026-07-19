import { initEmptyCategory } from '../category/category.factory';
import type { Ingredient } from './ingredient.entity';

export const initEmptyIngredient = (): Ingredient => ({
	_id: '',
	translations: {
		en: { name: '', unit: '', unit_plural: '' },
		pt: { name: '', unit: '', unit_plural: '' }
	},
	is_alcoholic: false,
	category: initEmptyCategory(),
	created_at: new Date(),
	updated_at: new Date()
});
