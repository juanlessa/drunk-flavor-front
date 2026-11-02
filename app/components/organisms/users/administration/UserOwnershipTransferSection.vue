<template>
	<ProfileSection
		v-if="isVisible"
		:title="$t('organisms.userAdministration.actions.requestOwnershipTransfer')"
		:description="description">
		<template #icon><ArrowRightIcon /></template>
		<template v-if="state === 'none'" #action>
			<Button variant="outline" :disabled="!isLoaded" @click="isRequestDialogOpen = true">
				{{ $t('organisms.userAdministration.actions.requestOwnershipTransfer') }}
			</Button>
		</template>

		<OwnershipTransferPending
			v-if="state === 'thisUser' && invitation"
			:invitation="invitation"
			:invitee="props.user"
			:show-invitee="false" />

		<template v-else-if="state === 'otherUser'">
			<div
				class="flex items-start gap-3 rounded-card bg-warning-surface p-4 text-body-sm text-warning"
				role="note">
				<span
					class="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-current text-[0.625rem] font-bold leading-none"
					aria-hidden="true">
					!
				</span>
				<!-- Plain elements: the Text/Anchor atoms set their own color over the warning tone. -->
				<div class="flex flex-col gap-1">
					<p class="font-medium">
						{{
							$t('organisms.ownershipTransfer.pending.otherPending', {
								name: otherInviteeName
							})
						}}
					</p>
					<p>
						{{ $t('organisms.ownershipTransfer.pending.otherPendingHint') }}
						<Anchor
							:to="localePath(`/users/${invitation?.targetUserId}`)"
							class="text-body-sm! font-medium! text-inherit! underline">
							{{ $t('organisms.ownershipTransfer.pending.viewInvitation') }}
						</Anchor>
					</p>
				</div>
			</div>
			<Button variant="outline" class="self-center tablet:self-start" disabled>
				{{ $t('organisms.userAdministration.actions.requestOwnershipTransfer') }}
			</Button>
		</template>

		<RequestOwnershipTransferDialog
			v-if="props.canRequest"
			v-model:open="isRequestDialogOpen"
			:target-user-id="props.user.id"
			@completed="load" />
	</ProfileSection>
</template>
<script setup lang="ts">
import ArrowRightIcon from '~/components/icons/ArrowRightIcon.vue';
import type { User } from '~/domain/user/user.entity';
import { getUserFullName } from '~/helpers/user.helpers';

type TransferState = 'none' | 'thisUser' | 'otherUser';

const props = defineProps({
	user: { type: Object as PropType<User>, required: true },
	/** Whether the backend lets the current actor invite this user (owner viewing an eligible admin). */
	canRequest: { type: Boolean, default: false }
});

const { $api } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();
const { invitation, isLoaded, isInvitee, load } = usePendingOwnershipTransfer();

const isRequestDialogOpen = ref(false);
const otherInvitee = ref<User>();

const state = computed<TransferState>(() => {
	if (!invitation.value) return 'none';
	return isInvitee(props.user.id) ? 'thisUser' : 'otherUser';
});

// The pending card also shows on the invitee's page even if they could no longer be invited.
const isVisible = computed(() => props.canRequest || state.value === 'thisUser');

const userName = computed(() => getUserFullName(props.user) || props.user.email);
const otherInviteeName = computed(() =>
	otherInvitee.value
		? getUserFullName(otherInvitee.value) || otherInvitee.value.email
		: t('organisms.ownershipTransfer.pending.unknownInvitee')
);

const description = computed(() =>
	state.value === 'thisUser'
		? t('organisms.ownershipTransfer.pending.thisUserDescription', { name: userName.value })
		: t('organisms.ownershipTransfer.request.description')
);

watch(
	() => (state.value === 'otherUser' ? invitation.value?.targetUserId : undefined),
	async (targetUserId) => {
		otherInvitee.value = undefined;
		if (!targetUserId) return;
		try {
			otherInvitee.value = await $api.users.get(targetUserId);
		} catch (error) {
			console.error(error);
		}
	},
	{ immediate: true }
);
</script>
