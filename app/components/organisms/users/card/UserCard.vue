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
					:tone="statusTones[props.user.status]"
					:value="$t(`users.statuses.${props.user.status}`)" />
			</div>
		</div>
		<ArrowRightIcon class="size-4 shrink-0 text-content-subtle" aria-hidden="true" />
	</button>
</template>
<script setup lang="ts">
import ArrowRightIcon from '~/components/icons/ArrowRightIcon.vue';
import type { BadgeTone } from '~/components/atoms/badge/Badge.types';
import type { User, UserStatus } from '~/domain/user/user.entity';

const props = defineProps({
	user: { type: Object as PropType<User>, required: true }
});

const emit = defineEmits<{
	(e: 'click'): void;
}>();

const { t } = useI18n();

const statusTones: Record<UserStatus, BadgeTone> = {
	active: 'success',
	suspended: 'warning',
	pending: 'neutral',
	idle: 'neutral',
	incomplete_profile: 'neutral'
};

// An incomplete profile has no name yet, so the email becomes the primary line.
const fullName = computed(() =>
	[props.user.name, props.user.surname].filter(Boolean).join(' ').trim()
);
const displayName = computed(() => fullName.value || props.user.email);
const secondaryLine = computed(() =>
	fullName.value ? props.user.email : t('organisms.usersControlOverview.noName')
);
</script>
