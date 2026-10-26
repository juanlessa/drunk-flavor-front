import type { User } from '../user/user.entity';

/**
 * Profile is the authenticated user's own account, returned by GET /me.
 * It has the exact same shape as {@link User} (including the discriminated
 * union on `status` for `incomplete_profile` accounts).
 */
export type Profile = User;
