import { IngredientKinds } from '~/domain/ingredient/ingredient.constants';
import type {
	CreateIngredient,
	UpdateIngredient,
	UpdateIngredientTranslation
} from '~/domain/ingredient/ingredient.dtos';
import type { Ingredient, IngredientTranslation } from '~/domain/ingredient/ingredient.entity';
import { languages } from '~/domain/shared/translations.constants';
import type { Translations } from '~/domain/shared/translations.types';
import type { IngredientForm } from '~/types/ingredient.types';

/** The translations as the form edits them: a missing description is an empty text. */
const toFormTranslations = (source: Translations<IngredientTranslation>) =>
	languages.reduce((acc, lang) => {
		acc[lang] = { ...source[lang], description: source[lang].description ?? '' };
		return acc;
	}, {} as Translations<IngredientTranslation>);

/** A description left empty is not sent, so the backend never receives an empty text. */
const toCreateTranslations = (source: Translations<IngredientTranslation>) =>
	languages.reduce((acc, lang) => {
		const { description, ...rest } = source[lang];
		const trimmed = description?.trim();
		acc[lang] = trimmed ? { ...rest, description: trimmed } : rest;
		return acc;
	}, {} as Translations<IngredientTranslation>);

/** On update an empty description is `null`, which removes the stored one (omitting it would keep it). */
const toUpdateTranslations = (source: Translations<IngredientTranslation>) =>
	languages.reduce((acc, lang) => {
		const { description, ...rest } = source[lang];
		acc[lang] = { ...rest, description: description?.trim() || null };
		return acc;
	}, {} as Translations<UpdateIngredientTranslation>);

export const mapIngredientToForm = (ingredient: Ingredient): IngredientForm => ({
	translations: toFormTranslations(ingredient.translations),
	categoryId: ingredient.category.id,
	kind: ingredient.kind,
	brand: ingredient.brand ?? '',
	measurable: ingredient.units.length > 0,
	unitIds: ingredient.units.map((unit) => unit.id)
});

/** Not measurable means no units, whatever was picked before the switch was turned off. */
const toUnitIds = ({ measurable, unitIds }: IngredientForm) => (measurable ? [...unitIds] : []);

const isBranded = ({ kind }: IngredientForm) => kind === IngredientKinds.branded;

export const mapFormToCreateIngredient = (ingredientForm: IngredientForm): CreateIngredient => ({
	translations: toCreateTranslations(ingredientForm.translations),
	categoryId: ingredientForm.categoryId,
	unitIds: toUnitIds(ingredientForm),
	kind: ingredientForm.kind,
	// The backend only accepts a brand on a branded ingredient.
	...(isBranded(ingredientForm) && { brand: ingredientForm.brand.trim() })
});

export const mapFormToUpdateIngredient = (
	id: string,
	ingredientForm: IngredientForm
): UpdateIngredient => ({
	id,
	translations: toUpdateTranslations(ingredientForm.translations),
	categoryId: ingredientForm.categoryId,
	unitIds: toUnitIds(ingredientForm),
	kind: ingredientForm.kind,
	// Going back to any brand must clear the stored brand, which `null` does.
	brand: isBranded(ingredientForm) ? ingredientForm.brand.trim() : null
});
