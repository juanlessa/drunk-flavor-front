import type { $Fetch } from 'nitropack';
import type { Ingredient, CreateIngredient, UpdateIngredient } from '~/types/ingredient';
import type { QueryParams } from '~/types/query';

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
		return $fetch<Ingredient[]>(path, { query });
	},

	async get(id: string) {
		return $fetch<Ingredient>(`${path}/${id}`);
	}
});
