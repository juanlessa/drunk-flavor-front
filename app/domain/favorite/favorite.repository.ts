import type { $Fetch } from 'nitropack';
import type { FavoriteDrinkIds, FavoritesPage, FavoritesQuery } from './favorite.dtos';
const path = '/me/favorites';
/** Every route acts on the signed-in person ("me") and needs a complete profile. */
export const favoritesRepository = ($fetch: $Fetch) => ({
	/** Idempotent: saving a drink that is already a favorite changes nothing. A new one past the limit is a 409. */
	async add(drinkId: string) {
		return $fetch<undefined>(`${path}/${drinkId}`, { method: 'PUT' });
	},
	/** Idempotent: removing a drink that is not a favorite changes nothing. */
	async remove(drinkId: string) {
		return $fetch<undefined>(`${path}/${drinkId}`, { method: 'DELETE' });
	},
	async list({ limit, cursor }: FavoritesQuery = {}, options?: { signal?: AbortSignal }) {
		return $fetch<FavoritesPage>(path, {
			query: {
				...(limit !== undefined && { limit }),
				...(cursor !== undefined && { cursor })
			},
			signal: options?.signal
		});
	},
	async listDrinkIds(options?: { signal?: AbortSignal }) {
		return $fetch<FavoriteDrinkIds>(`${path}/ids`, { signal: options?.signal });
	}
});
