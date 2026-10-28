import type { EntityMetadata } from '../shared/entity.types';
import type { UserStatuses } from './user.constants';
import type { Role } from './user.types';

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

type UserBase = EntityMetadata & {
	email: string;
	emailVerified: boolean;
	avatarUrl?: string;
	role: Role;
};

export type IncompleteProfileUser = UserBase & {
	status: typeof UserStatuses.incomplete_profile;
	name?: string;
	surname?: string;
};

export type CompleteUser = UserBase & {
	status: Exclude<UserStatus, typeof UserStatuses.incomplete_profile>;
	name: string;
	surname: string;
};

export type User = IncompleteProfileUser | CompleteUser;
