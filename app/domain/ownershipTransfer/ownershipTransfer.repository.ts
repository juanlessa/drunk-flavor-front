import type { $Fetch } from 'nitropack';
import type { AcceptOwnershipTransfer, RequestOwnershipTransfer } from './ownershipTransfer.dtos';
import type { OwnershipTransferInvitation } from './ownershipTransfer.entity';

const path = '/administration/ownership-transfer';

export const ownershipTransferRepository = ($fetch: $Fetch) => ({
	async getPending() {
		return $fetch<OwnershipTransferInvitation | null>(path);
	},
	async request(body: RequestOwnershipTransfer) {
		return $fetch<undefined>(path, { method: 'POST', body });
	},
	async resend() {
		return $fetch<undefined>(`${path}/resend`, { method: 'POST' });
	},
	async cancel() {
		return $fetch<undefined>(path, { method: 'DELETE' });
	},
	async accept(body: AcceptOwnershipTransfer) {
		return $fetch<undefined>(`${path}/accept`, { method: 'POST', body });
	}
});
