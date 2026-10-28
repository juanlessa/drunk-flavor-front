import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import { mapUnitResponse, type UnitResponse } from './unit.api';
import type { CreateUnit, UpdateUnit } from './unit.dtos';

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
		const response = await $fetch<UnitResponse[]>(path, { query: serializeListQuery(query) });
		return response.map(mapUnitResponse);
	},
	async get(id: string) {
		return mapUnitResponse(await $fetch<UnitResponse>(`${path}/${id}`));
	}
});
