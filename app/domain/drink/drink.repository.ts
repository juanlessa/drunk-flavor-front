import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateDrink, UpdateDrink } from './drink.dtos';
import type { Drink } from './drink.entity';

const path = '/drinks';

export const drinksRepository = ($fetch: $Fetch) => ({
	async create(body: CreateDrink) {
		return $fetch<{ id: string }>(path, {
			method: 'POST',
			body
		});
	},

	async update(body: UpdateDrink) {
		return $fetch<undefined>(path, {
			method: 'PATCH',
			body
		});
	},

	async updateCover(id: string, file: File) {
		const formData = new FormData();
		formData.append('cover', file);

		return $fetch<undefined>(`${path}/${id}/cover`, {
			method: 'PATCH',
			body: formData
		});
	},

	async updateThumbnail(id: string, file: File) {
		const formData = new FormData();
		formData.append('thumbnail', file);

		return $fetch<undefined>(`${path}/${id}/thumbnail`, {
			method: 'PATCH',
			body: formData
		});
	},

	async delete(id: string) {
		return $fetch<undefined>(path, {
			method: 'DELETE',
			body: { id }
		});
	},

	async list(query: QueryParams) {
		return $fetch<Drink[]>(path, { query: serializeListQuery(query) });
	},

	async get(id: string) {
		return $fetch<Drink>(`${path}/${id}`);
	}
});
