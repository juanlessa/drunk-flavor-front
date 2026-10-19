import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateIngredient, UpdateIngredient } from './ingredient.dtos';
import type { Ingredient } from './ingredient.entity';

const path = '/ingredients';

export const ingredientsRepository = ($fetch: $Fetch) => ({
	async create(body: CreateIngredient) {
		return $fetch(path, {
			method: 'POST',
			body
		});
	},

	async update(body: UpdateIngredient) {
		return $fetch(path, {
			method: 'PATCH',
			body
		});
	},

	async delete(id: string) {
		return $fetch(path, {
			method: 'DELETE',
			body: { id }
		});
	},

	async list(query: QueryParams) {
		return $fetch<Ingredient[]>(path, { query: serializeListQuery(query) });
	},

	async get(id: string) {
		return $fetch<Ingredient>(`${path}/${id}`);
	}
});
