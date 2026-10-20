import type { QueryParams } from './query.types';

export type SerializedListQuery = {
	page: number;
	limit: number;
	search?: string;
	sort?: string;
};

/**
 * Serializes list query params for the backend.
 *
 * The backend list schemas wrap `search` and `sort` in `stringifiedJSONSchema`,
 * meaning they expect a JSON string that the backend `JSON.parse`s. `page` and
 * `limit` stay as plain scalars (the backend coerces them with `z.coerce.number`).
 * `search`/`sort` are stringified only when defined and are omitted entirely when
 * `undefined` so no empty keys are sent on the query.
 */
export const serializeListQuery = (query: QueryParams): SerializedListQuery => {
	const serialized: SerializedListQuery = {
		page: query.page,
		limit: query.limit
	};

	if (query.search !== undefined) {
		serialized.search = JSON.stringify(query.search);
	}

	if (query.sort !== undefined) {
		serialized.sort = JSON.stringify(query.sort);
	}

	return serialized;
};
