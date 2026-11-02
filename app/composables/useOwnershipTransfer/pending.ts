import { Roles } from '~/domain/user/user.constants';
import type { OwnershipTransferInvitation } from '~/domain/ownershipTransfer/ownershipTransfer.entity';

type PendingOwnershipTransferState = {
	invitation: OwnershipTransferInvitation | null;
	/** True once the invitation was fetched (or skipped for non-owners) at least once. */
	isLoaded: boolean;
	isLoading: boolean;
	hasError: boolean;
};

const initState = (): PendingOwnershipTransferState => ({
	invitation: null,
	isLoaded: false,
	isLoading: false,
	hasError: false
});

/**
 * The single pending ownership transfer invitation of the current owner, shared by the profile,
 * the user administration page and the users list so they all show the same state after any
 * change. Each page loads it once on mount (one request, never one per list item) so the state
 * is fresh after a sign-in as someone else. Only the owner can read it (the backend answers 403
 * otherwise), so other viewers resolve to "no invitation" without a request.
 */
export const usePendingOwnershipTransfer = () => {
	const { $api, $auth } = useNuxtApp();
	const state = useState<PendingOwnershipTransferState>('pendingOwnershipTransfer', initState);

	const isOwner = computed(() => $auth.state.value.user?.role === Roles.owner);
	const invitation = computed(() => state.value.invitation);
	const isExpired = computed(
		() => !!invitation.value && new Date(invitation.value.expiresAt).getTime() <= Date.now()
	);

	const load = async (): Promise<void> => {
		if (!isOwner.value) {
			state.value = { ...initState(), isLoaded: true };
			return;
		}
		state.value.isLoading = true;
		state.value.hasError = false;
		try {
			// An empty body (no invitation) arrives as an empty value rather than `null`.
			state.value.invitation = (await $api.ownershipTransfer.getPending()) || null;
		} catch (error) {
			console.error(error);
			state.value.hasError = true;
		} finally {
			state.value.isLoading = false;
			state.value.isLoaded = true;
		}
	};

	const resend = async () => {
		await $api.ownershipTransfer.resend();
		await load();
	};

	const cancel = async () => {
		await $api.ownershipTransfer.cancel();
		state.value.invitation = null;
	};

	const isInvitee = (userId: string) => invitation.value?.targetUserId === userId;

	return {
		invitation,
		isOwner,
		isExpired,
		isLoading: computed(() => state.value.isLoading),
		hasError: computed(() => state.value.hasError),
		isLoaded: computed(() => state.value.isLoaded),
		load,
		resend,
		cancel,
		isInvitee
	};
};
