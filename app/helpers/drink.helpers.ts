import type { DrinkIngredientAmount } from '~/domain/drink/drink.entity';
import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import type { DrinkIngredientAmountRequest } from '~/domain/drink/drink.dtos';
import type { Language } from '~/domain/shared/translations.types';
import { formatUnitQuantity } from './unit.helpers';

/**
 * How an amount is written on a drink page ("60 ml"). Empty when there is nothing to measure: an amount with no
 * quantity (to taste, top up...) says nothing here, because those qualifiers have no wording yet.
 */
export const formatDrinkAmount = (amount: DrinkIngredientAmount, locale: Language): string => {
	if (amount.type === DrinkIngredientAmountTypes.none) return '';
	if (amount.quantity === undefined || amount.unit === undefined) return '';
	return formatUnitQuantity(amount.quantity, amount.unit, locale);
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
