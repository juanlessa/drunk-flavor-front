import type { IngredientForm } from '~/types/ingredient.types';

export const initEmptyIngredientForm = (): IngredientForm => ({
	translations: {
		en: { name: '', unit: '', unit_plural: '' },
		pt: { name: '', unit: '', unit_plural: '' }
	},
	is_alcoholic: false,
	category_id: ''
});
