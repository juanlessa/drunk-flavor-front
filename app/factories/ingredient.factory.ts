import type { IngredientForm } from '~/types/ingredient.types';

export const initEmptyIngredientForm = (): IngredientForm => ({
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	category_id: '',
	unit_id: ''
});
