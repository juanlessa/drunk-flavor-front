import type { $Fetch } from 'nitropack';
import type { IIngredient, ICreateIngredient, IUpdateIngredient } from '~/types/ingredient';

const path = '/ingredients';

export const ingredientsRepository = ($fetch: $Fetch) => ({
	async create(body: ICreateIngredient) {
		return $fetch(path, {
			method: 'POST',
			body
		});
	},

	async update(body: IUpdateIngredient) {
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

	async list() {
		return $fetch<IIngredient[]>(path);
	},

	async get(id: string) {
		return $fetch<IIngredient>(`${path}/${id}`);
	}
});
