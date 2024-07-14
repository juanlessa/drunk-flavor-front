import type { $Fetch } from 'nitropack';
import type { ICreateUser, IUpdateUser, IUpdateUserRole, IUser, IUserProfile } from '~/types/user';

const path = '/users';

export const usersRepository = ($fetch: $Fetch) => ({
	async createUser(body: ICreateUser) {
		return $fetch(path, {
			method: 'POST',
			body
		});
	},

	async updateUser(body: IUpdateUser) {
		return $fetch(path, {
			method: 'PATCH',
			body
		});
	},

	async updateUserRole(body: IUpdateUserRole) {
		return $fetch(`${path}/role`, {
			method: 'PATCH',
			body
		});
	},

	async deleteUser(id: string) {
		return $fetch(path, {
			method: 'DELETE',
			body: { id }
		});
	},

	async getUsers() {
		return $fetch<IUser[]>(path);
	},

	async me() {
		return $fetch<IUserProfile>(`${path}/me`);
	}
});
