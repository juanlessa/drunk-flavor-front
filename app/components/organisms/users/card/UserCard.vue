<template>
	<button
		type="button"
		class="w-full flex items-center gap-4 p-4 text-left bg-surface border border-stroke shadow-card rounded-card cursor-pointer hover:bg-surface-hover transition-colors duration-short focus-visible:outline-hidden focus-visible:shadow-focus-ring"
		@click="emit('click')">
		<Avatar size="sm" :src="props.user.avatarUrl" :alt="displayName" />
		<div
			class="min-w-0 flex-1 flex flex-col gap-2 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4">
			<div class="min-w-0">
				<Text as="span" class="block truncate font-medium text-content">
					{{ displayName }}
				</Text>
				<Text as="span" class="block truncate text-body-sm text-content-muted">
					{{ secondaryLine }}
				</Text>
			</div>
			<div class="flex flex-wrap gap-2 tablet:shrink-0 tablet:flex-nowrap">
				<Badge tone="accent" :value="$t(`users.roles.${props.user.role}`)" />
				<Badge
					:tone="getUserStatusBadgeTone(props.user.status)"
					:value="$t(`users.statuses.${props.user.status}`)" />
				<Badge
					v-if="props.ownershipInvitee"
					tone="warning"
					:value="$t('organisms.ownershipTransfer.pending.listBadge')" />
			</div>
		</div>
		<ArrowRightIcon class="size-4 shrink-0 text-content-subtle" aria-hidden="true" />
	</button>
</template>
<script setup lang="ts">
import ArrowRightIcon from '~/components/icons/ArrowRightIcon.vue';
import type { User } from '~/domain/user/user.entity';
import { getUserFullName, getUserStatusBadgeTone } from '~/helpers/user.helpers';

const props = defineProps({
	user: { type: Object as PropType<User>, required: true },
	/** Marks the invitee of the owner's pending ownership transfer. */
	ownershipInvitee: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'click'): void;
}>();

const { t } = useI18n();

// An incomplete profile has no name yet, so the email becomes the primary line.
const fullName = computed(() => getUserFullName(props.user));
const displayName = computed(() => fullName.value || props.user.email);
const secondaryLine = computed(() =>
	fullName.value ? props.user.email : t('organisms.usersControlOverview.noName')
);
</script>
