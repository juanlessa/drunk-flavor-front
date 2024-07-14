import type { $Fetch } from 'nitropack';
import type { ICategory, ICreateCategory, IUpdateCategory } from '~/types/category';
import type { QueryParams } from '~/types/query';

const path = '/categories';

export const categoriesRepository = ($fetch: $Fetch) => ({
	async createCategory(body: ICreateCategory) {
		return $fetch(path, {
			method: 'POST',
			body
		});
	},

	async updateCategory(body: IUpdateCategory) {
		return $fetch(path, {
			method: 'PATCH',
			body
		});
	},

	async deleteCategory(id: string) {
		return $fetch(path, {
			method: 'DELETE',
			body: { id }
		});
	},

	async getCategories(query: QueryParams) {
		return $fetch<ICategory[]>(path, { query });
	},

	async getCategory(id: string) {
		return $fetch<ICategory>(`${path}/${id}`);
	}
});
