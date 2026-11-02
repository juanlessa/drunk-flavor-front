<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header class="flex flex-col gap-2">
			<Anchor :to="localePath('/users')" class="inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('organisms.userAdministration.backLink') }}
			</Anchor>
			<Heading as="h1" size="headlineSm">
				{{ $t('organisms.userAdministration.title') }}
			</Heading>
		</header>

		<UserAdministrationSummarySkeleton v-if="isLoading" />

		<Text v-else-if="hasError || !user" class="text-content-muted">
			{{ $t('organisms.userAdministration.loadErrorMessage') }}
		</Text>

		<template v-else>
			<UserAdministrationSummary :user="user" />

			<section class="flex flex-col gap-4" aria-labelledby="user-administration-actions">
				<Heading id="user-administration-actions" as="h2" size="titleSm">
					{{ $t('organisms.userAdministration.actions.title') }}
				</Heading>

				<template v-for="section in availableSections" :key="section.action">
					<!-- Ownership transfer has its own card: it follows the pending invitation. -->
					<UserOwnershipTransferSection
						v-if="
							section.action ===
							UserAdministrativeCapabilityActions.requestOwnershipTransfer
						"
						:user="user"
						:can-request="can(section.action)" />
					<ProfileSection
						v-else
						:title="$t(`organisms.userAdministration.actions.${section.action}`)"
						:description="$t(section.descriptionKey)"
						:tone="section.tone">
						<template #icon><component :is="section.icon" /></template>
						<template #action>
							<Button
								variant="outline"
								:class="
									section.tone === 'danger'
										? 'border-danger-stroke text-danger'
										: ''
								"
								@click="openAction(section.action)">
								{{ $t(`organisms.userAdministration.actions.${section.action}`) }}
							</Button>
						</template>
					</ProfileSection>
				</template>

				<Text v-if="!availableSections.length" class="text-content-muted">
					{{ $t('organisms.userAdministration.actions.none') }}
				</Text>
			</section>

			<UserReasonActionDialog
				v-if="reasonAction"
				v-model:open="isReasonDialogOpen"
				:user-id="props.userId"
				:action="reasonAction"
				@completed="handleReasonActionCompleted" />
			<ChangeUserRoleDialog
				v-if="can(UserAdministrativeCapabilityActions.changeRole)"
				v-model:open="isRoleDialogOpen"
				:user-id="props.userId"
				:role-transitions="capabilities?.roleTransitions ?? []"
				@completed="refresh" />
		</template>
	</div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
import ArrowRightIcon from '~/components/icons/ArrowRightIcon.vue';
import CheckIcon from '~/components/icons/CheckIcon.vue';
import LockIcon from '~/components/icons/LockIcon.vue';
import LogoutIcon from '~/components/icons/LogoutIcon.vue';
import ProfileIcon from '~/components/icons/ProfileIcon.vue';
import TrashIcon from '~/components/icons/TrashIcon.vue';
import { UserAdministrativeCapabilityActions } from '~/domain/user/user.constants';
import type { UserAdministrativeCapabilityAction } from '~/domain/user/user.types';
import type { UserReasonAction } from '~/types/user.types';

type ActionSection = {
	action: UserAdministrativeCapabilityAction;
	icon: Component;
	descriptionKey: string;
	tone: 'default' | 'danger';
};

// Display order of the action cards; each one only renders when the backend grants it.
const ACTION_SECTIONS: ActionSection[] = [
	{
		action: UserAdministrativeCapabilityActions.changeRole,
		icon: ProfileIcon,
		descriptionKey: 'organisms.userAdministration.roleDialog.description',
		tone: 'default'
	},
	{
		action: UserAdministrativeCapabilityActions.requestOwnershipTransfer,
		icon: ArrowRightIcon,
		descriptionKey: 'organisms.ownershipTransfer.request.description',
		tone: 'default'
	},
	{
		action: UserAdministrativeCapabilityActions.revokeSessions,
		icon: LogoutIcon,
		descriptionKey: 'organisms.userAdministration.reasonDialog.revokeSessions.description',
		tone: 'default'
	},
	{
		action: UserAdministrativeCapabilityActions.reactivate,
		icon: CheckIcon,
		descriptionKey: 'organisms.userAdministration.reasonDialog.reactivate.description',
		tone: 'default'
	},
	{
		action: UserAdministrativeCapabilityActions.suspend,
		icon: LockIcon,
		descriptionKey: 'organisms.userAdministration.reasonDialog.suspend.description',
		tone: 'danger'
	},
	{
		action: UserAdministrativeCapabilityActions.close,
		icon: TrashIcon,
		descriptionKey: 'organisms.userAdministration.reasonDialog.close.description',
		tone: 'danger'
	}
];

const REASON_ACTIONS: UserAdministrativeCapabilityAction[] = [
	UserAdministrativeCapabilityActions.suspend,
	UserAdministrativeCapabilityActions.reactivate,
	UserAdministrativeCapabilityActions.close,
	UserAdministrativeCapabilityActions.revokeSessions
];

const props = defineProps({
	userId: { type: String, required: true }
});

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { user, capabilities, isLoading, hasError, can, refresh } = useUserAdministration(
	props.userId
);

const reasonAction = ref<UserReasonAction>();
const isReasonDialogOpen = ref(false);
const isRoleDialogOpen = ref(false);
const { isInvitee, load: loadPendingTransfer } = usePendingOwnershipTransfer();
// Loaded here, not in the transfer card: the card's visibility depends on it.
onMounted(loadPendingTransfer);

// The transfer card also stays for the invitee of a pending transfer, so the owner can resend
// or cancel from their page even when the backend no longer offers a new request for them.
const isSectionAvailable = (action: UserAdministrativeCapabilityAction) =>
	can(action) ||
	(action === UserAdministrativeCapabilityActions.requestOwnershipTransfer &&
		isInvitee(props.userId));

const availableSections = computed(() =>
	ACTION_SECTIONS.filter((section) => isSectionAvailable(section.action))
);

const isReasonAction = (action: UserAdministrativeCapabilityAction): action is UserReasonAction =>
	REASON_ACTIONS.includes(action);

const openAction = (action: UserAdministrativeCapabilityAction) => {
	if (isReasonAction(action)) {
		reasonAction.value = action;
		isReasonDialogOpen.value = true;
		return;
	}
	if (action === UserAdministrativeCapabilityActions.changeRole) {
		isRoleDialogOpen.value = true;
	}
};

// A closed account leaves administration entirely, so go back to the list instead of reloading it.
const handleReasonActionCompleted = async (action: UserReasonAction) => {
	if (action === 'close') {
		await $router.push(localePath('/users'));
		return;
	}
	await refresh();
};
</script>
