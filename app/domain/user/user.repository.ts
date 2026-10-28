import type { $Fetch } from 'nitropack';
import type { QueryParams } from '~/domain/shared/query.types';
import { serializeListQuery } from '~/domain/shared/query.helpers';
import { mapUserResponse, type UserResponse } from './user.api';
import type { CreateUser, UpdateRole } from './user.dtos';

const path = '/users';

export const usersRepository = ($fetch: $Fetch) => ({
	async create(body: CreateUser) {
		return $fetch<undefined>(path, { method: 'POST', body });
	},
	async updateRole(body: UpdateRole) {
		return $fetch<undefined>(`${path}/role`, { method: 'PATCH', body });
	},
	async list(query: QueryParams) {
		const response = await $fetch<UserResponse[]>(path, { query: serializeListQuery(query) });
		return response.map(mapUserResponse);
	},
	async get(id: string) {
		return mapUserResponse(await $fetch<UserResponse>(`${path}/${id}`));
	}
});
