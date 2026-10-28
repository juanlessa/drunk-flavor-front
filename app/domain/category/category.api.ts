import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import type { Category } from './category.entity';

export type CategoryResponse = ApiResponse<Category>;
export const mapCategoryResponse = (response: CategoryResponse): Category =>
	mapEntityMetadata<Category>(response);
