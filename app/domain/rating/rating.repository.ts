import type { $Fetch } from 'nitropack';
import type { PaginatedQueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateRating, CreateRatingResponse, UpdateRating } from './rating.dtos';
import type { Rating } from './rating.entity';

const path = '/ratings';

export const ratingsRepository = ($fetch: $Fetch) => ({
	async create(body: CreateRating) {
		return $fetch<CreateRatingResponse>(path, {
			method: 'POST',
			body
		});
	},
	async update({ id, ...body }: UpdateRating) {
		return $fetch<undefined>(`${path}/${id}`, {
			method: 'PATCH',
			body
		});
	},
	async delete(id: string) {
		return $fetch<undefined>(`${path}/${id}`, {
			method: 'DELETE'
		});
	},
	async get(id: string) {
		return $fetch<Rating>(`${path}/${id}`);
	},
	async list(query: PaginatedQueryParams) {
		return $fetch<Rating[]>(path, { query: serializeListQuery(query) });
	},
	async listByDrink(drinkId: string, query: PaginatedQueryParams) {
		return $fetch<Rating[]>(`/drinks/${drinkId}/ratings`, {
			query: serializeListQuery(query)
		});
	},
	async listMine(query: PaginatedQueryParams) {
		return $fetch<Rating[]>('/me/ratings', { query: serializeListQuery(query) });
	}
});
