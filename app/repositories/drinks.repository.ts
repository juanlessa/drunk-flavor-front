import type { $Fetch } from 'nitropack';
import type { Drink, CreateDrink, UpdateDrink } from '~/types/drink';
import type { QueryParams } from '~/types/query';

const path = '/drinks';

export const drinksRepository = ($fetch: $Fetch) => ({
	async create(body: CreateDrink) {
		return $fetch<{ id: string }>(path, {
			method: 'POST',
			body
		});
	},

	async update(body: UpdateDrink) {
		return $fetch(path, {
			method: 'PATCH',
			body
		});
	},

	async updateCover(id: string, file: File) {
		const formData = new FormData();
		formData.append('cover', file);

		return $fetch(`${path}/${id}/cover`, {
			method: 'PATCH',
			body: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},

	async updateThumbnail(id: string, file: File) {
		const formData = new FormData();
		formData.append('thumbnail', file);

		return $fetch(`${path}/${id}/thumbnail`, {
			method: 'PATCH',
			body: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},

	async delete(id: string) {
		return $fetch(path, {
			method: 'DELETE',
			body: { id }
		});
	},

	async list(query: QueryParams) {
		return $fetch<Drink[]>(path, { query });
	},

	async get(id: string) {
		return $fetch<Drink>(`${path}/${id}`);
	}
});
