import type { $Fetch } from 'nitropack';
import type { PaginatedQueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import { mapRatingResponse, type RatingResponse } from './rating.api';
import type {
	CreateRating,
	CreateRatingResponse,
	RatingMutationResponse,
	UpdateRating
} from './rating.dtos';
import type { RatingSummary } from './rating.entity';

const path = '/ratings';
const mapList = (response: RatingResponse[]) => response.map(mapRatingResponse);

export const ratingsRepository = ($fetch: $Fetch) => ({
	async create(body: CreateRating) {
		return $fetch<CreateRatingResponse>(path, { method: 'POST', body });
	},
	async update({ id, ...body }: UpdateRating) {
		return $fetch<RatingMutationResponse>(`${path}/${id}`, { method: 'PATCH', body });
	},
	async delete(id: string) {
		return $fetch<RatingMutationResponse>(`${path}/${id}`, { method: 'DELETE' });
	},
	async get(id: string) {
		return mapRatingResponse(await $fetch<RatingResponse>(`${path}/${id}`));
	},
	async getSummaryByDrink(drinkId: string) {
		return $fetch<RatingSummary>(`/drinks/${drinkId}/ratings/summary`);
	},
	async getMineByDrink(drinkId: string) {
		const response = await $fetch<RatingResponse | null>(`/drinks/${drinkId}/ratings/me`);
		return response ? mapRatingResponse(response) : null;
	},
	async list(query: PaginatedQueryParams) {
		return mapList(await $fetch<RatingResponse[]>(path, { query: serializeListQuery(query) }));
	},
	async listByDrink(drinkId: string, query: PaginatedQueryParams) {
		return mapList(
			await $fetch<RatingResponse[]>(`/drinks/${drinkId}/ratings`, {
				query: serializeListQuery(query)
			})
		);
	},
	async listMine(query: PaginatedQueryParams) {
		return mapList(
			await $fetch<RatingResponse[]>('/me/ratings', { query: serializeListQuery(query) })
		);
	}
});
