import type { $Fetch } from 'nitropack';
import type { ICategory, ICreateCategory, IUpdateCategory } from '~/types/category';

export class CategoriesRepository {
	private path = '/categories';
	private $fetch: $Fetch;

	constructor(fetcher: $Fetch) {
		this.$fetch = fetcher;
	}

	async createCategory(body: ICreateCategory) {
		return this.$fetch(this.path, {
			method: 'POST',
			body
		});
	}

	async updateCategory(body: IUpdateCategory) {
		return this.$fetch(this.path, {
			method: 'PATCH',
			body
		});
	}

	async deleteteCategory(id: string) {
		return this.$fetch(this.path, {
			method: 'DELETE',
			body: { id }
		});
	}

	async getCategories() {
		return this.$fetch<ICategory[]>(this.path);
	}

	async getCategory(id: string) {
		return this.$fetch<ICategory>(`${this.path}/${id}`);
	}
}
