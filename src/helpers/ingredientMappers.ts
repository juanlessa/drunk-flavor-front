import { languages } from '~/constants/translations';
import type {
	IIngredient,
	IngredientForm,
	IIngredientTranslation,
	ICreateIngredient,
	IUpdateIngredient
} from '~/types/ingredient';
import type { ITranslations } from '~/types/translations';

export const mapIngredientToForm = (ingredient: IIngredient): IngredientForm => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...ingredient.translations[lang] };
		return acc;
	}, {} as ITranslations<IIngredientTranslation>);

	return {
		translations,
		is_alcoholic: ingredient.is_alcoholic,
		category_id: ingredient.category._id
	};
};

export const mapFormToCreateIngredient = (ingredientForm: IngredientForm): ICreateIngredient => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...ingredientForm.translations[lang] };
		return acc;
	}, {} as ITranslations<IIngredientTranslation>);

	return {
		translations,
		is_alcoholic: ingredientForm.is_alcoholic,
		category_id: ingredientForm.category_id
	};
};

export const mapFormToUpdateIngredient = (
	id: string,
	ingredientForm: IngredientForm
): IUpdateIngredient => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...ingredientForm.translations[lang] };
		return acc;
	}, {} as ITranslations<IIngredientTranslation>);

	return {
		id,
		translations,
		is_alcoholic: ingredientForm.is_alcoholic,
		category_id: ingredientForm.category_id
	};
};
