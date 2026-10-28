import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import { mapDrinkResponse, type DrinkResponse } from './drink.api';
import type { CreateDrink, UpdateDrink } from './drink.dtos';

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
		const response = await $fetch<DrinkResponse[]>(path, { query: serializeListQuery(query) });
		return response.map(mapDrinkResponse);
	},
	async get(id: string) {
		return mapDrinkResponse(await $fetch<DrinkResponse>(`${path}/${id}`));
	}
});
