import { mapCategoryResponse } from '../category/category.api';
import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import { mapUnitResponse } from '../unit/unit.api';
import type { Ingredient } from './ingredient.entity';

export type IngredientResponse = ApiResponse<Ingredient>;
export const mapIngredientResponse = (response: IngredientResponse): Ingredient =>
	mapEntityMetadata<Ingredient>(response, {
		category: mapCategoryResponse(response.category),
		unit: mapUnitResponse(response.unit)
	});
