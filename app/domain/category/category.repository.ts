import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import { mapCategoryResponse, type CategoryResponse } from './category.api';
import type { CreateCategory, UpdateCategory } from './category.dtos';

const path = '/categories';

export const categoriesRepository = ($fetch: $Fetch) => ({
	async create(body: CreateCategory) {
		return $fetch<undefined>(path, { method: 'POST', body });
	},
	async update(body: UpdateCategory) {
		return $fetch<undefined>(path, { method: 'PATCH', body });
	},
	async delete(id: string) {
		return $fetch<undefined>(path, { method: 'DELETE', body: { id } });
	},
	async list(query: QueryParams) {
		const response = await $fetch<CategoryResponse[]>(path, {
			query: serializeListQuery(query)
		});
		return response.map(mapCategoryResponse);
	},
	async get(id: string) {
		return mapCategoryResponse(await $fetch<CategoryResponse>(`${path}/${id}`));
	}
});
