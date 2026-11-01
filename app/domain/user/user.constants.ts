export const Roles = {
	owner: 'owner',
	admin: 'admin',
	partner: 'partner',
	member: 'member'
} as const;

export const UserStatuses = {
	idle: 'idle',
	pending: 'pending',
	active: 'active',
	suspended: 'suspended',
	incomplete_profile: 'incomplete_profile'
} as const;

export const UserAdministrativeCapabilityActions = {
	changeRole: 'changeRole',
	suspend: 'suspend',
	reactivate: 'reactivate',
	close: 'close',
	revokeSessions: 'revokeSessions',
	requestOwnershipTransfer: 'requestOwnershipTransfer'
} as const;

export const USER_ADMINISTRATION_REASON_MIN_LENGTH = 10;
export const USER_ADMINISTRATION_REASON_MAX_LENGTH = 500;
