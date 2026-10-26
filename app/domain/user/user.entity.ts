import type { DatabaseCommonInfo } from '../shared/database.types';
import type { UserStatuses } from './user.constants';
import type { Role } from './user.types';

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

type UserBase = DatabaseCommonInfo & {
	email: string;
	email_verified: boolean;
	avatar_url?: string;
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

/**
 * User =
 *     _id: string
 *     name: string (optional only when status == "incomplete_profile")
 *     surname: string (optional only when status == "incomplete_profile")
 *     status: UserStatus ("idle" | "pending" | "active" | "incomplete_profile")
 *     email: string
 *     email_verified: boolean
 *     avatar_url?: string
 *     role: Role ("admin" | "partner" | "member")
 *     created_at: Date
 *     updated_at: Date
 *
 * Discriminated union on `status`: in the `incomplete_profile` variant `name`
 * and `surname` are optional; in every other status they are required. Narrow
 * on `status` to access `name`/`surname` as guaranteed strings.
 */
export type User = IncompleteProfileUser | CompleteUser;
