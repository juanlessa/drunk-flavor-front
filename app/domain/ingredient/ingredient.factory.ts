import { initEmptyCategory } from '../category/category.factory';
import { IngredientKinds } from './ingredient.constants';
import type { Ingredient } from './ingredient.entity';
export const initEmptyIngredient = (): Ingredient => ({
	id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	category: initEmptyCategory(),
	units: [],
	kind: IngredientKinds.generic,
	brand: undefined,
	createdAt: new Date(),
	updatedAt: new Date()
});
