<template>
	<div class="flex flex-col gap-4" data-testid="ownership-transfer-pending">
		<div class="flex flex-col gap-3 rounded-card bg-surface-sunken p-4">
			<div
				v-if="props.showInvitee"
				class="flex flex-col gap-2 tablet:flex-row tablet:items-start tablet:justify-between">
				<div class="flex min-w-0 items-center gap-3">
					<Avatar size="sm" :src="invitee?.avatarUrl ?? ''" :alt="inviteeName" />
					<div class="min-w-0">
						<Anchor
							:to="localePath(`/users/${props.invitation.targetUserId}`)"
							class="block truncate font-bold! hover:underline">
							{{ inviteeName }}
						</Anchor>
						<Text
							v-if="inviteeDetails"
							class="truncate text-body-sm text-content-muted">
							{{ inviteeDetails }}
						</Text>
					</div>
				</div>
				<Badge class="self-start" :tone="badgeTone" :value="badgeLabel" />
			</div>
			<Badge v-else class="self-start" :tone="badgeTone" :value="badgeLabel" />
			<div class="flex flex-col gap-1">
				<Text
					as="span"
					class="text-caption font-bold uppercase tracking-wide text-content-muted">
					{{ $t('organisms.ownershipTransfer.pending.reasonLabel') }}
				</Text>
				<Text class="text-body text-content-secondary whitespace-pre-line wrap-break-word">
					{{ props.invitation.reason }}
				</Text>
			</div>
			<Text class="text-caption" :class="isExpired ? 'text-warning' : 'text-content-muted'">
				{{ expiryLine }}
			</Text>
		</div>
		<!-- Full-width stacked actions on mobile; side by side from tablet up. -->
		<div class="flex flex-col items-center gap-3 tablet:flex-row">
			<Button
				:variant="isExpired ? 'primary' : 'outline'"
				class="tablet:w-auto"
				:disabled="isBusy"
				@click="handleResend">
				{{ $t('organisms.ownershipTransfer.pending.resendButton') }}
			</Button>
			<Button
				variant="outline"
				class="border-danger-stroke text-danger tablet:w-auto"
				:disabled="isBusy"
				@click="isCancelDialogOpen = true">
				{{ $t('organisms.ownershipTransfer.pending.cancelButton') }}
			</Button>
		</div>
		<DeleteModal
			v-model:open="isCancelDialogOpen"
			:title="$t('organisms.ownershipTransfer.pending.cancelDialog.title')"
			:description="
				$t('organisms.ownershipTransfer.pending.cancelDialog.description', {
					name: inviteeName
				})
			"
			:cancel-label="$t('organisms.ownershipTransfer.pending.cancelDialog.keepButton')"
			:confirm-label="$t('organisms.ownershipTransfer.pending.cancelButton')"
			@delete="handleCancel" />
		<ReauthenticationDialog
			:open="requiresReauthentication"
			@reauthenticated="handleReauthenticated"
			@cancel="cancelReauthentication" />
	</div>
</template>
<script setup lang="ts">
import type { BadgeTone } from '~/components/atoms/badge/Badge.types';
import type { OwnershipTransferInvitation } from '~/domain/ownershipTransfer/ownershipTransfer.entity';
import type { User } from '~/domain/user/user.entity';
import { formatDateTime, formatRelativeTime } from '~/helpers/date.helpers';
import { getUserFullName } from '~/helpers/user.helpers';

const props = defineProps({
	invitation: { type: Object as PropType<OwnershipTransferInvitation>, required: true },
	/** The invited user, when already loaded by the page (e.g. on their administration page). */
	invitee: { type: Object as PropType<User>, default: undefined },
	/** Shows who was invited; off where the page itself is about that user. */
	showInvitee: { type: Boolean, default: true }
});

const { $api } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { resend, cancel } = usePendingOwnershipTransfer();
const {
	isRequired: requiresReauthentication,
	run,
	confirm,
	cancel: cancelReauthentication
} = useReauthentication();

const loadedInvitee = ref<User>();
const invitee = computed(() => props.invitee ?? loadedInvitee.value);
const isCancelDialogOpen = ref(false);
const isBusy = ref(false);

const inviteeName = computed(() => {
	if (!invitee.value) return t('organisms.ownershipTransfer.pending.unknownInvitee');
	return getUserFullName(invitee.value) || invitee.value.email;
});
const inviteeDetails = computed(() =>
	invitee.value ? `${invitee.value.email} · ${t(`users.roles.${invitee.value.role}`)}` : ''
);

const isExpired = computed(() => new Date(props.invitation.expiresAt).getTime() <= Date.now());
const badgeTone = computed<BadgeTone>(() => (isExpired.value ? 'warning' : 'accent'));
const badgeLabel = computed(() =>
	isExpired.value
		? t('organisms.ownershipTransfer.pending.expiredBadge')
		: t('organisms.ownershipTransfer.pending.expiresBadge', {
				time: formatRelativeTime(props.invitation.expiresAt, locale.value)
			})
);
const expiryLine = computed(() =>
	t(
		isExpired.value
			? 'organisms.ownershipTransfer.pending.expiredAt'
			: 'organisms.ownershipTransfer.pending.expiresAt',
		{ date: formatDateTime(props.invitation.expiresAt, locale.value) }
	)
);

/** Runs a reauthentication-protected command once, reporting its outcome as a toast. */
const submit = async (
	execute: () => Promise<void>,
	messages: { success: string; error: string }
) => {
	if (isBusy.value) return;
	isBusy.value = true;
	try {
		await execute();
		// A reauthentication challenge leaves the command pending: no outcome to report yet.
		if (requiresReauthentication.value) return;
		addToast({
			type: 'success',
			title: t('organisms.ownershipTransfer.toast.successTitle'),
			message: t(messages.success)
		});
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.ownershipTransfer.toast.errorTitle'),
			message: t(messages.error)
		});
	} finally {
		isBusy.value = false;
	}
};

const RESEND_MESSAGES = {
	success: 'organisms.ownershipTransfer.pending.resendSuccessMessage',
	error: 'organisms.ownershipTransfer.pending.resendErrorMessage'
};
const CANCEL_MESSAGES = {
	success: 'organisms.ownershipTransfer.pending.cancelSuccessMessage',
	error: 'organisms.ownershipTransfer.pending.cancelErrorMessage'
};
let pendingMessages = RESEND_MESSAGES;

const handleResend = () => {
	pendingMessages = RESEND_MESSAGES;
	return submit(() => run(resend), RESEND_MESSAGES);
};

const handleCancel = () => {
	isCancelDialogOpen.value = false;
	pendingMessages = CANCEL_MESSAGES;
	return submit(() => run(cancel), CANCEL_MESSAGES);
};

const handleReauthenticated = () => submit(confirm, pendingMessages);

onMounted(async () => {
	if (props.invitee || !props.showInvitee) return;
	try {
		loadedInvitee.value = await $api.users.get(props.invitation.targetUserId);
	} catch (error) {
		// The invitation still renders with a generic name; resend and cancel keep working.
		console.error(error);
	}
});
</script>
