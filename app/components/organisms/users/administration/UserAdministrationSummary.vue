<template>
	<Card class="flex flex-col gap-6 p-5 tablet:p-6">
		<div class="flex items-center gap-4">
			<Avatar :src="props.user.avatarUrl" :alt="displayName" />
			<div class="min-w-0 flex-1">
				<Heading as="h2" size="titleSm" class="truncate">{{ displayName }}</Heading>
				<Text class="truncate text-body-sm text-content-muted">{{ secondaryLine }}</Text>
				<div class="mt-2 flex flex-wrap gap-2">
					<Badge tone="accent" :value="roleLabel" />
					<Badge :tone="getUserStatusBadgeTone(props.user.status)" :value="statusLabel" />
				</div>
			</div>
		</div>

		<dl class="grid grid-cols-1 gap-4 border-t border-stroke pt-4 tablet:grid-cols-3">
			<div>
				<dt class="text-body-sm text-content-muted">
					{{ $t('organisms.userAdministration.fields.role') }}
				</dt>
				<dd class="font-medium text-content">{{ roleLabel }}</dd>
			</div>
			<div>
				<dt class="text-body-sm text-content-muted">
					{{ $t('organisms.userAdministration.fields.status') }}
				</dt>
				<dd class="font-medium text-content">{{ statusLabel }}</dd>
			</div>
			<div>
				<dt class="text-body-sm text-content-muted">
					{{ $t('organisms.userAdministration.fields.emailVerified') }}
				</dt>
				<dd class="inline-flex items-center gap-1 font-medium text-content">
					<CheckIcon
						v-if="props.user.emailVerified"
						class="size-4 fill-current text-success"
						aria-hidden="true" />
					{{
						$t(
							`organisms.userAdministration.fields.${props.user.emailVerified ? 'verified' : 'notVerified'}`
						)
					}}
				</dd>
			</div>
		</dl>
	</Card>
</template>

<script setup lang="ts">
import CheckIcon from '~/components/icons/CheckIcon.vue';
import type { User } from '~/domain/user/user.entity';
import { getUserFullName, getUserStatusBadgeTone } from '~/helpers/user.helpers';

const props = defineProps({
	user: { type: Object as PropType<User>, required: true }
});

const { t } = useI18n();

const fullName = computed(() => getUserFullName(props.user));
const displayName = computed(() => fullName.value || props.user.email);
const secondaryLine = computed(() =>
	fullName.value ? props.user.email : t('organisms.usersControlOverview.noName')
);
const roleLabel = computed(() => t(`users.roles.${props.user.role}`));
const statusLabel = computed(() => t(`users.statuses.${props.user.status}`));
</script>
