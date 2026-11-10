import type { $Fetch } from 'nitropack';
import type { Authored } from '../shared/entity.types';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateCategory, UpdateCategory } from './category.dtos';
import type { Category } from './category.entity';

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
		return $fetch<Category[]>(path, { query: serializeListQuery(query) });
	},
	async get(id: string) {
		return $fetch<Category>(`${path}/${id}`);
	},
	/**
	 * For the people who contribute to the catalog (partner, admin, owner): the categories they created come first,
	 * and each one carries who created and last edited it. Takes the same search, sort and paging as `list`.
	 */
	async listWithAuthorship(query: QueryParams) {
		return $fetch<Authored<Category>[]>(`${path}/me`, { query: serializeListQuery(query) });
	},
	/** One category with who created and last edited it. Same roles as `listWithAuthorship`. */
	async getWithAuthorship(id: string) {
		return $fetch<Authored<Category>>(`${path}/me/${id}`);
	}
});
