/** Public view of the singleton invitation returned to the current owner. */
export type OwnershipTransferInvitation = {
	targetUserId: string;
	reason: string;
	expiresAt: Date;
};
