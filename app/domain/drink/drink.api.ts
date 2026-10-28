import { mapIngredientResponse } from '../ingredient/ingredient.api';
import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import type { Drink } from './drink.entity';

export type DrinkResponse = ApiResponse<Drink>;
export const mapDrinkResponse = (response: DrinkResponse): Drink =>
	mapEntityMetadata<Drink>(response, {
		ingredients: response.ingredients.map(({ ingredient, quantity }) => ({
			ingredient: mapIngredientResponse(ingredient),
			quantity
		}))
	});
