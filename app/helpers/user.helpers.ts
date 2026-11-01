import type { BadgeTone } from '~/components/atoms/badge/Badge.types';
import type { User, UserStatus } from '~/domain/user/user.entity';

const STATUS_BADGE_TONES: Record<UserStatus, BadgeTone> = {
	active: 'success',
	suspended: 'warning',
	pending: 'neutral',
	idle: 'neutral',
	incomplete_profile: 'neutral'
};

export const getUserStatusBadgeTone = (status: UserStatus): BadgeTone => STATUS_BADGE_TONES[status];

/** Name and surname, or an empty string when the profile is still incomplete. */
export const getUserFullName = (user: Pick<User, 'name' | 'surname'>): string =>
	[user.name, user.surname].filter(Boolean).join(' ').trim();
