import { UserStatuses } from '~/domain/user/user.constants';
import type { Profile } from '~/domain/profile/profile.entity';

/** Page where an `incomplete_profile` account must add its name before using the site. */
export const COMPLETE_PROFILE_PATH = '/complete-profile';

export const isIncompleteProfile = (user?: Profile): boolean =>
	user?.status === UserStatuses.incomplete_profile;
