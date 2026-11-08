import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateDrink, GeneratedMethod, GenerateMethod, UpdateDrink } from './drink.dtos';
import type { Drink } from './drink.entity';

const path = '/drinks';

export const drinksRepository = ($fetch: $Fetch) => ({
	async create(body: CreateDrink) {
		return $fetch<{ id: string }>(path, { method: 'POST', body });
	},
	async update(body: UpdateDrink) {
		return $fetch<undefined>(path, { method: 'PATCH', body });
	},
	async updateCover(id: string, file: File) {
		const body = new FormData();
		body.append('cover', file);
		return $fetch<undefined>(`${path}/${id}/cover`, { method: 'PATCH', body });
	},
	async updateThumbnail(id: string, file: File) {
		const body = new FormData();
		body.append('thumbnail', file);
		return $fetch<undefined>(`${path}/${id}/thumbnail`, { method: 'PATCH', body });
	},
	async delete(id: string) {
		return $fetch<undefined>(path, { method: 'DELETE', body: { id } });
	},
	async list(query: QueryParams) {
		return $fetch<Drink[]>(path, { query: serializeListQuery(query) });
	},
	async get(id: string, options?: { signal?: AbortSignal }) {
		return $fetch<Drink>(`${path}/${id}`, { signal: options?.signal });
	},
	/** Writes the method of a drink from its preparation plan, without saving anything. */
	async generateMethod(body: GenerateMethod) {
		return $fetch<GeneratedMethod>(`${path}/method`, { method: 'POST', body });
	}
});
