import type { Roles, UserAdministrativeCapabilityActions } from './user.constants';

export type Role = (typeof Roles)[keyof typeof Roles];
export type NonOwnerRole = Exclude<Role, typeof Roles.owner>;

export type UserAdministrativeCapabilityAction =
	(typeof UserAdministrativeCapabilityActions)[keyof typeof UserAdministrativeCapabilityActions];
