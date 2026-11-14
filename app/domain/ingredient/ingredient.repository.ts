import type { $Fetch } from 'nitropack';
import type { Authored } from '../shared/entity.types';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type { CreateIngredient, ListIngredientsOptions, UpdateIngredient } from './ingredient.dtos';
import type { Ingredient } from './ingredient.entity';

const path = '/ingredients';

export const ingredientsRepository = ($fetch: $Fetch) => ({
	async create(body: CreateIngredient) {
		return $fetch<undefined>(path, { method: 'POST', body });
	},
	async update(body: UpdateIngredient) {
		return $fetch<undefined>(path, { method: 'PATCH', body });
	},
	async delete(id: string) {
		return $fetch<undefined>(path, { method: 'DELETE', body: { id } });
	},
	/**
	 * Searching by `name` ranks the ingredients by where the words are found, and the `sort` only breaks the ties
	 * between the ones of the same rank: 1) the name, 2) the description or brand, 3) the name of the category.
	 * Every word of the term must start a word of the ingredient, and it ranks as its worst word.
	 */
	async list(query: QueryParams, options: ListIngredientsOptions = {}) {
		return $fetch<Ingredient[]>(path, {
			query: {
				...serializeListQuery(query),
				...(options.inUse !== undefined && { inUse: options.inUse })
			}
		});
	},
	async get(id: string) {
		return $fetch<Ingredient>(`${path}/${id}`);
	},
	/**
	 * For the people who contribute to the catalog (partner, admin, owner): the ingredients they created come first,
	 * and each one carries who created and last edited it. Takes the same search, sort and paging as `list`, but not
	 * `inUse`.
	 */
	async listWithAuthorship(query: QueryParams) {
		return $fetch<Authored<Ingredient>[]>(`${path}/me`, { query: serializeListQuery(query) });
	},
	/** One ingredient with who created and last edited it. Same roles as `listWithAuthorship`. */
	async getWithAuthorship(id: string) {
		return $fetch<Authored<Ingredient>>(`${path}/me/${id}`);
	}
});
