import type { $Fetch } from 'nitropack';
import type { QueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type {
	CloseUser,
	CreateUser,
	ReactivateUser,
	RevokeUserSessions,
	SuspendUser,
	UpdateRole,
	UserAdministrativeCapabilities
} from './user.dtos';
import type { User } from './user.entity';

const path = '/users';

export const usersRepository = ($fetch: $Fetch) => ({
	async create(body: CreateUser) {
		return $fetch<undefined>(path, { method: 'POST', body });
	},
	async updateRole(body: UpdateRole) {
		return $fetch<undefined>(`${path}/role`, { method: 'PATCH', body });
	},
	async list(query: QueryParams) {
		return $fetch<User[]>(path, { query: serializeListQuery(query) });
	},
	async get(id: string) {
		return $fetch<User>(`${path}/${id}`);
	},
	async getAdministrativeCapabilities(id: string) {
		return $fetch<UserAdministrativeCapabilities>(`${path}/${id}/administrative-capabilities`);
	},
	async suspend(id: string, body: SuspendUser) {
		return $fetch<undefined>(`${path}/${id}/suspension`, { method: 'POST', body });
	},
	async reactivate(id: string, body: ReactivateUser) {
		return $fetch<undefined>(`${path}/${id}/reactivation`, { method: 'POST', body });
	},
	async close(id: string, body: CloseUser) {
		return $fetch<undefined>(`${path}/${id}/closure`, { method: 'POST', body });
	},
	async revokeSessions(id: string, body: RevokeUserSessions) {
		return $fetch<undefined>(`${path}/${id}/session-revocation`, { method: 'POST', body });
	}
});
