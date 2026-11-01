export type RequestOwnershipTransfer = {
	targetUserId: string;
	reason: string;
};

export type AcceptOwnershipTransfer = {
	token: string;
};
