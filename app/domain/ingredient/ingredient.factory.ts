import { initEmptyCategory } from '../category/category.factory';
import { initEmptyUnit } from '../unit/unit.factory';
import type { Ingredient } from './ingredient.entity';

export const initEmptyIngredient = (): Ingredient => ({
	_id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	category: initEmptyCategory(),
	unit: initEmptyUnit(),
	created_at: new Date(),
	updated_at: new Date()
});
