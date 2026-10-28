import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import { mapIngredientResponse, type IngredientResponse } from './ingredient.api';
import type { CreateIngredient, UpdateIngredient } from './ingredient.dtos';

const path = '/ingredients';

export const ingredientsRepository = ($fetch: $Fetch) => ({
	async create(body: CreateIngredient) {
		return $fetch<undefined>(path, { method: 'POST', body });
	},
	async update(body: UpdateIngredient) {
		return $fetch<undefined>(path, { method: 'PATCH', body });
	},
	async delete(id: string) {
		return $fetch<undefined>(path, { method: 'DELETE', body: { id } });
	},
	async list(query: QueryParams) {
		const response = await $fetch<IngredientResponse[]>(path, {
			query: serializeListQuery(query)
		});
		return response.map(mapIngredientResponse);
	},
	async get(id: string) {
		return mapIngredientResponse(await $fetch<IngredientResponse>(`${path}/${id}`));
	}
});
