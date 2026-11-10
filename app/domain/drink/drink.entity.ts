import type { Ingredient } from '../ingredient/ingredient.entity';
import type { PreparationPlan } from '../preparation/preparation.entity';
import type { EntityMetadata } from '../shared/entity.types';
import type { Translations } from '../shared/translations.types';
import type { Unit } from '../unit/unit.entity';
import type {
	DrinkIngredientAmountTypes,
	DrinkIngredientQualifiers,
	DrinkListSorts,
	drinkMatchMaxMissing
} from './drink.constants';

export type DrinkTranslation = { name: string; method: string };
export type FileMetadata = { name: string; mimetype: string; url: string };

export type DrinkIngredientQualifier =
	(typeof DrinkIngredientQualifiers)[keyof typeof DrinkIngredientQualifiers];
export type DrinkIngredientAmountType =
	(typeof DrinkIngredientAmountTypes)[keyof typeof DrinkIngredientAmountTypes];

/**
 * The amount of an ingredient within a drink.
 * - `exact`: a precise `quantity` in `unit` (e.g. 50 ml).
 * - `qualitative`: a `qualifier` with an optional approximate `quantity`/`unit` hint (e.g. top up, ≈ 120 ml).
 * - `none`: no amount applies (e.g. ginger foam, a garnish).
 *
 * `unit` is a snapshot of one of the ingredient's units, taken when the drink was saved.
 */
export type DrinkIngredientAmount =
	| { type: typeof DrinkIngredientAmountTypes.exact; quantity: number; unit: Unit }
	| {
			type: typeof DrinkIngredientAmountTypes.qualitative;
			qualifier: DrinkIngredientQualifier;
			quantity?: number;
			unit?: Unit;
	  }
	| { type: typeof DrinkIngredientAmountTypes.none };

/** What a recipe line shares between the ingredients and the garnishes. */
export type DrinkRecipeItem = {
	ingredient: Ingredient;
	amount: DrinkIngredientAmount;
};
/** A component of the recipe. It may be optional (e.g. a finishing foam). */
export type DrinkIngredient = DrinkRecipeItem & { optional: boolean };
/** A finishing touch (e.g. a lime wedge, a mint sprig). Always optional by nature. */
export type DrinkGarnish = DrinkRecipeItem;

export type Drink = EntityMetadata & {
	translations: Translations<DrinkTranslation>;
	cover?: FileMetadata;
	thumbnail?: FileMetadata;
	ingredients: DrinkIngredient[];
	/** Garnishes are listed apart from the ingredients and may be empty. */
	garnishes: DrinkGarnish[];
	/**
	 * How the drink is prepared, as data. When present, the `method` of every language was written from it.
	 * Absent for drinks whose method was written by hand.
	 */
	preparation?: PreparationPlan;
	avgRating: number;
	ratingsCount: number;
};

/** How many required ingredients may be missing when matching drinks by ingredients. */
export type DrinkMatchMaxMissing = (typeof drinkMatchMaxMissing)[number];

/** A drink found by the ingredients a person has, with the required ingredients that are missing. */
export type DrinkMatch = {
	drink: Drink;
	missingCount: number;
	/** Ids of ingredients of the drink; their names are in `drink.ingredients`. */
	missingIngredientIds: string[];
};

/** The order a person picks for the drinks list. */
export type DrinkListSort = (typeof DrinkListSorts)[keyof typeof DrinkListSorts];
