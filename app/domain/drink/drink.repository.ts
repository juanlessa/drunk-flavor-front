import type { $Fetch } from 'nitropack';
import { HTTP_QUERY_METHOD } from '../shared/api.constants';
import type { Authored } from '../shared/entity.types';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type {
	CreateDrink,
	GeneratedMethod,
	GenerateMethod,
	MatchDrinks,
	MatchDrinksQuery,
	MatchDrinksResponse,
	UpdateDrink
} from './drink.dtos';
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
	/**
	 * For the people who contribute to the catalog (partner, admin, owner): the drinks they created come first, and
	 * each one carries who created and last edited it. Takes the same search, sort and paging as `list`.
	 */
	async listWithAuthorship(query: QueryParams) {
		return $fetch<Authored<Drink>[]>(`${path}/me`, { query: serializeListQuery(query) });
	},
	/** One drink with who created and last edited it. Same roles as `listWithAuthorship`. */
	async getWithAuthorship(id: string, options?: { signal?: AbortSignal }) {
		return $fetch<Authored<Drink>>(`${path}/me/${id}`, { signal: options?.signal });
	},
	/**
	 * The drinks that can be made, or nearly, with the given ingredients, the most complete first.
	 *
	 * It is a read with a body, so it uses the HTTP QUERY method (RFC 10008). ofetch only serializes the body of
	 * POST, PUT, PATCH and DELETE, so the JSON and its content type are set here.
	 */
	async match(body: MatchDrinks, query: MatchDrinksQuery, options?: { signal?: AbortSignal }) {
		return $fetch<MatchDrinksResponse>(`${path}/match`, {
			method: HTTP_QUERY_METHOD,
			query,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
			signal: options?.signal
		});
	},
	/** Writes the method of a drink from its preparation plan, without saving anything. */
	async generateMethod(body: GenerateMethod) {
		return $fetch<GeneratedMethod>(`${path}/method`, { method: 'POST', body });
	}
});
