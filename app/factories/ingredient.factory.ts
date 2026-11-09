import { IngredientKinds } from '~/domain/ingredient/ingredient.constants';
import type { IngredientForm } from '~/types/ingredient.types';
export const initEmptyIngredientForm = (): IngredientForm => ({
	translations: {
		en: { name: '', namePlural: '', description: '' },
		pt: { name: '', namePlural: '', description: '' }
	},
	categoryId: '',
	kind: IngredientKinds.generic,
	brand: '',
	measurable: true,
	unitIds: [],
	requiresNamePlural: false
});
