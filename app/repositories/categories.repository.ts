import type { $Fetch } from 'nitropack';
import type { Category, CreateCategory, UpdateCategory } from '~/types/category';
import type { QueryParams } from '~/types/query';

const path = '/categories';

export const categoriesRepository = ($fetch: $Fetch) => ({
	async create(body: CreateCategory) {
		return $fetch(path, {
			method: 'POST',
			body
		});
	},

	async update(body: UpdateCategory) {
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
		return $fetch<Category[]>(path, { query });
	},

	async get(id: string) {
		return $fetch<Category>(`${path}/${id}`);
	}
});
