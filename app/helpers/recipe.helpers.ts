import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import type { DrinkIngredientAmountRequest } from '~/domain/drink/drink.dtos';
import type { RecipeItemRef, RecipeList } from '~/domain/preparation/preparation.entity';
import type { Language } from '~/domain/shared/translations.types';
import type { Unit } from '~/domain/unit/unit.entity';
import type { DrinkRecipeLineForm } from '~/types/drink.types';

/** The unit a recipe line is measured in, if any: the one of an exact amount or of the hint of a qualitative one. */
export const getLineUnitId = (line: Pick<DrinkRecipeLineForm, 'amount'>): string | undefined =>
	'unitId' in line.amount ? line.amount.unitId : undefined;

export const getLineUnit = (line: DrinkRecipeLineForm): Unit | undefined => {
	const unitId = getLineUnitId(line);
	return unitId === undefined ? undefined : line.ingredient.units.find(({ id }) => id === unitId);
};

/** Points a preparation action at a recipe line, as the API expects it. */
export const toRecipeItemRef = (
	list: RecipeList,
	line: DrinkRecipeLineForm,
	withUnit = false
): RecipeItemRef => {
	const unitId = getLineUnitId(line);
	return {
		list,
		ingredientId: line.ingredient.id,
		...(unitId && { unitId }),
		...(withUnit && unitId && { withUnit })
	};
};

/** Identifies the recipe line a reference points at; two references to the same line share it. */
export const getRecipeItemKey = ({ list, ingredientId, unitId }: RecipeItemRef): string =>
	`${list}:${ingredientId}:${unitId ?? ''}`;

export type RecipeItemChoice = {
	key: string;
	ref: RecipeItemRef;
	list: RecipeList;
	/** Name of the ingredient in the given language. */
	name: string;
	/** Name of the unit the line is measured in, if any. */
	unitName?: string;
};

/** Every recipe line a preparation action can point at, from the lists the action accepts. */
export const buildItemChoices = (
	lines: Partial<Record<RecipeList, DrinkRecipeLineForm[]>>,
	lists: readonly RecipeList[],
	language: Language
): RecipeItemChoice[] =>
	lists.flatMap((list) =>
		(lines[list] ?? []).map((line) => {
			const ref = toRecipeItemRef(list, line);
			const unit = getLineUnit(line);
			return {
				key: getRecipeItemKey(ref),
				ref,
				list,
				name: line.ingredient.translations[language].name,
				...(unit && { unitName: unit.symbol || unit.translations[language].name })
			};
		})
	);

/** A hint (or an exact quantity) of zero or less means there is none. */
export const hasQuantity = (amount: DrinkIngredientAmountRequest): boolean =>
	'quantity' in amount && amount.quantity !== undefined && amount.quantity > 0;

/** The amount as it is sent: a qualitative amount without a hint carries no quantity and no unit. */
export const cleanAmount = (amount: DrinkIngredientAmountRequest): DrinkIngredientAmountRequest => {
	if (amount.type !== DrinkIngredientAmountTypes.qualitative) return amount;
	if (hasQuantity(amount)) return amount;
	return { type: amount.type, qualifier: amount.qualifier };
};

/** A reference that points at nothing yet: what an action holds before its item is chosen. */
export const emptyItemRef = (list: RecipeList): RecipeItemRef => ({ list, ingredientId: '' });

/** Whether the reference points at a recipe line at all. */
export const hasItem = (item: RecipeItemRef | undefined): item is RecipeItemRef =>
	!!item && item.ingredientId.length > 0;
