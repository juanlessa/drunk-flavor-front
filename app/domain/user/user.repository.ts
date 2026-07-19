import type { $Fetch } from 'nitropack';
import type { CreateUser, UpdateRole } from './user.dtos';
import type { User } from './user.entity';

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

	async list() {
		return $fetch<User[]>(path);
	},

	async get(id: string) {
		return $fetch<User>(`${path}/${id}`);
	}
});
