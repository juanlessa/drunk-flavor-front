import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateCategory, UpdateCategory } from './category.dtos';
import type { Category } from './category.entity';

const path = '/categories';

export const categoriesRepository = ($fetch: $Fetch) => ({
	async create(body: CreateCategory) {
		return $fetch<undefined>(path, {
			method: 'POST',
			body
		});
	},

	async update(body: UpdateCategory) {
		return $fetch<undefined>(path, {
			method: 'PATCH',
			body
		});
	},

	async delete(id: string) {
		return $fetch<undefined>(path, {
			method: 'DELETE',
			body: { id }
		});
	},

	async list(query: QueryParams) {
		return $fetch<Category[]>(path, { query: serializeListQuery(query) });
	},

	async get(id: string) {
		return $fetch<Category>(`${path}/${id}`);
	}
});
