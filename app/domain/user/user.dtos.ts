import type { NonOwnerRole, Role, UserAdministrativeCapabilityAction } from './user.types';

export type CreateUser = {
	name: string;
	surname: string;
	email: string;
	password: string;
	role: Role;
};

export type UpdateRole = {
	userId: string;
	role: NonOwnerRole;
};

export type UserAdministrationReason = { reason: string };
export type SuspendUser = UserAdministrationReason;
export type ReactivateUser = UserAdministrationReason;
export type CloseUser = UserAdministrationReason;
export type RevokeUserSessions = UserAdministrationReason;

export type UserAdministrativeCapabilities = {
	actions: UserAdministrativeCapabilityAction[];
	roleTransitions: NonOwnerRole[];
};
