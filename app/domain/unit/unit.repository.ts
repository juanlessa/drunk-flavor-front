import type { $Fetch } from 'nitropack';
import type { Authored } from '../shared/entity.types';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateUnit, UpdateUnit } from './unit.dtos';
import type { Unit } from './unit.entity';

const path = '/units';

export const unitsRepository = ($fetch: $Fetch) => ({
	async create(body: CreateUnit) {
		return $fetch<undefined>(path, { method: 'POST', body });
	},
	async update(body: UpdateUnit) {
		return $fetch<undefined>(path, { method: 'PATCH', body });
	},
	async delete(id: string) {
		return $fetch<undefined>(path, { method: 'DELETE', body: { id } });
	},
	async list(query: QueryParams) {
		return $fetch<Unit[]>(path, { query: serializeListQuery(query) });
	},
	async get(id: string) {
		return $fetch<Unit>(`${path}/${id}`);
	},
	/**
	 * For the people who contribute to the catalog (partner, admin, owner): the units they created come first,
	 * and each one carries who created and last edited it. Takes the same search, sort and paging as `list`.
	 */
	async listWithAuthorship(query: QueryParams) {
		return $fetch<Authored<Unit>[]>(`${path}/me`, { query: serializeListQuery(query) });
	},
	/** One unit with who created and last edited it. Same roles as `listWithAuthorship`. */
	async getWithAuthorship(id: string) {
		return $fetch<Authored<Unit>>(`${path}/me/${id}`);
	}
});
