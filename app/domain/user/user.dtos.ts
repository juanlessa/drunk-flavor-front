import type { NonOwnerRole, UserAdministrativeCapabilityAction } from './user.types';

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
