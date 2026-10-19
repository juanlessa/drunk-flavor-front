import type { $Fetch } from 'nitropack';
import type { CreateUser, UpdateRole } from './user.dtos';
import type { User } from './user.entity';
import type { QueryParams } from '~/domain/shared/query.types';
import { serializeListQuery } from '~/domain/shared/query.helpers';

const path = '/users';

export const usersRepository = ($fetch: $Fetch) => ({
	async create(body: CreateUser) {
		return $fetch(path, {
			method: 'POST',
			body
		});
	},

	async updateRole(body: UpdateRole) {
		return $fetch(`${path}/role`, {
			method: 'PATCH',
			body
		});
	},

	async delete(id: string) {
		return $fetch(path, {
			method: 'DELETE',
			body: { id }
		});
	},

	async list(query: QueryParams) {
		return $fetch<User[]>(path, {
			query: serializeListQuery(query)
		});
	},

	async get(id: string) {
		return $fetch<User>(`${path}/${id}`);
	}
});
