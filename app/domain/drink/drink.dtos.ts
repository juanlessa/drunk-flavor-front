import type { PreparationPlan } from '../preparation/preparation.entity';
import type { ApiFieldError } from '../shared/api.types';
import type { Translations } from '../shared/translations.types';
import type { DrinkIngredientAmountTypes } from './drink.constants';
import type { DrinkIngredientQualifier, DrinkTranslation } from './drink.entity';

/** The amount of a recipe line as it is sent: the unit is referenced by `unitId`, one of the ingredient's units. */
export type DrinkIngredientAmountRequest =
	| { type: typeof DrinkIngredientAmountTypes.exact; quantity: number; unitId: string }
	| {
			type: typeof DrinkIngredientAmountTypes.qualitative;
			qualifier: DrinkIngredientQualifier;
			quantity?: number;
			unitId?: string;
	  }
	| { type: typeof DrinkIngredientAmountTypes.none };
/** What an ingredient line and a garnish line have in common. */
export type DrinkRecipeItemRequest = {
	ingredientId: string;
	amount: DrinkIngredientAmountRequest;
};
export type DrinkIngredientRequest = DrinkRecipeItemRequest & { optional: boolean };
/** A garnish is always optional by nature, so it has no `optional` flag. */
export type DrinkGarnishRequest = DrinkRecipeItemRequest;

/**
 * The method of a drink is sent in exactly one of two ways, and the API rejects both together:
 * - written by hand: the `method` of each language, and no plan;
 * - generated: a `preparation` plan, and no `method`. The backend writes the method of every language from it.
 */
export type ManualMethodRequest = {
	translations: Translations<DrinkTranslation>;
	preparation?: undefined;
};
export type GeneratedMethodRequest = {
	translations: Translations<Pick<DrinkTranslation, 'name'>>;
	preparation: PreparationPlan;
};
export type DrinkMethodRequest = ManualMethodRequest | GeneratedMethodRequest;

export type CreateDrink = DrinkMethodRequest & {
	ingredients: DrinkIngredientRequest[];
	/** Defaults to no garnishes when omitted. */
	garnishes?: DrinkGarnishRequest[];
};
export type UpdateDrink = DrinkMethodRequest & {
	id: string;
	ingredients: DrinkIngredientRequest[];
	/** Full replacement of the garnishes; send an empty list to remove them all. */
	garnishes: DrinkGarnishRequest[];
};

/** The recipe lines of a drink and the plan to write its method from. Nothing is saved. */
export type GenerateMethod = {
	ingredients: DrinkIngredientRequest[];
	garnishes?: DrinkGarnishRequest[];
	preparation: PreparationPlan;
};
export type GeneratedMethod = {
	/** The whole method in each language. */
	method: Translations<string>;
	/** The same method, one sentence per entry. */
	sentences: Translations<string[]>;
	/** Unusual but valid choices in the plan; they do not stop the method from being written. */
	warnings: ApiFieldError[];
};
