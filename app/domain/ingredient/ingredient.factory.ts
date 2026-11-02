import { initEmptyCategory } from '../category/category.factory';
import { initEmptyUnit } from '../unit/unit.factory';
import type { Ingredient } from './ingredient.entity';

export const initEmptyIngredient = (): Ingredient => ({
	id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	category: initEmptyCategory(),
	unit: initEmptyUnit(),
	createdAt: new Date(),
	updatedAt: new Date()
});
