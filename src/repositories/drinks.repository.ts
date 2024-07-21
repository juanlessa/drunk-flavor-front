import type { $Fetch } from 'nitropack';
import type { Drink, CreateDrink, UpdateDrink } from '~/types/drink';
import type { QueryParams } from '~/types/query';

const path = '/drinks';

export const drinksRepository = ($fetch: $Fetch) => ({
	async create(body: CreateDrink) {
		return $fetch(path, {
			method: 'POST',
			body
		});
	},

	async update(body: UpdateDrink) {
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
		return $fetch<Drink[]>(path, { query });
	},

	async get(id: string) {
		return $fetch<Drink>(`${path}/${id}`);
	}
});
