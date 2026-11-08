import type { DrinkIngredientAmount, DrinkRecipeItem } from '~/domain/drink/drink.entity';
import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import type { DrinkIngredientAmountRequest } from '~/domain/drink/drink.dtos';
import type { Language } from '~/domain/shared/translations.types';
import { getIngredientNameForQuantity } from './ingredient.helpers';
import { formatQuantityValue, formatUnitQuantity } from './unit.helpers';

/**
 * How an amount is written on a drink page ("60 ml"). Empty when there is nothing to measure: an amount with no
 * quantity (to taste, top up...) says nothing here, because those qualifiers have no wording yet.
 */
export const formatDrinkAmount = (amount: DrinkIngredientAmount, locale: Language): string => {
	if (amount.type === DrinkIngredientAmountTypes.none) return '';
	if (amount.quantity === undefined || amount.unit === undefined) return '';
	return formatUnitQuantity(amount.quantity, amount.unit, locale);
};

/**
 * How a recipe line is written on a drink page, split in the pieces the page lays out. Usually it is the amount,
 * "of" and the ingredient name ("60 ml of Gin"). When the unit is written with the ingredient name, the quantity
 * is followed by the name in the form that fits it, with no "of" ("3 Limes").
 */
export const formatDrinkRecipeItem = (
	{ amount, ingredient }: DrinkRecipeItem,
	locale: Language
): { measurement: string; name: string; joinedByPreposition: boolean } => {
	const name = ingredient.translations[locale]?.name ?? '';
	if (
		amount.type !== DrinkIngredientAmountTypes.none &&
		amount.quantity !== undefined &&
		amount.unit?.useIngredientName
	) {
		return {
			measurement: formatQuantityValue(amount.quantity, locale),
			name: getIngredientNameForQuantity(ingredient, amount.quantity, locale),
			joinedByPreposition: false
		};
	}
	const measurement = formatDrinkAmount(amount, locale);
	return { measurement, name, joinedByPreposition: measurement !== '' };
};

/** The amount of a recipe line as the API receives it: the unit snapshot becomes a reference to its id. */
export const mapAmountToRequest = (amount: DrinkIngredientAmount): DrinkIngredientAmountRequest => {
	switch (amount.type) {
		case DrinkIngredientAmountTypes.exact:
			return { type: amount.type, quantity: amount.quantity, unitId: amount.unit.id };
		case DrinkIngredientAmountTypes.qualitative:
			return {
				type: amount.type,
				qualifier: amount.qualifier,
				...(amount.quantity === undefined ? {} : { quantity: amount.quantity }),
				...(amount.unit === undefined ? {} : { unitId: amount.unit.id })
			};
		case DrinkIngredientAmountTypes.none:
			return { type: amount.type };
	}
};
