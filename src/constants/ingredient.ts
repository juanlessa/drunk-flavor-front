import type { IIngredient, IngredientForm } from '~/types/ingredient';
import { initEmptyCategory } from '~/constants/category';

export const initEmptyIngredient = (): IIngredient => ({
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

export const initEmptyIngredientForm = (): IngredientForm => ({
	translations: {
		en: { name: '', unit: '', unit_plural: '' },
		pt: { name: '', unit: '', unit_plural: '' }
	},
	is_alcoholic: false,
	category_id: ''
});
