<template>
	<ProfileSection
		:title="$t('organisms.ownershipTransfer.section.title')"
		:description="$t('organisms.ownershipTransfer.section.description')">
		<template #icon><CrownIcon /></template>
		<div v-if="!isLoaded" class="h-lh flex items-center text-body-sm" aria-hidden="true">
			<AnimatedPlaceHolder class="h-[1em] w-48 rounded-xs" />
		</div>
		<Text v-else-if="hasError" class="text-body-sm text-danger" role="alert">
			{{ $t('organisms.ownershipTransfer.pending.loadError') }}
		</Text>
		<OwnershipTransferPending v-else-if="invitation" :invitation="invitation" />
		<div v-else class="flex flex-col gap-1 text-body-sm">
			<Text class="text-content-secondary">
				{{ $t('organisms.ownershipTransfer.section.noneMessage') }}
			</Text>
			<Anchor
				:to="localePath('/users')"
				class="self-start inline-flex items-center gap-1 text-body-sm! font-medium text-accent-content!">
				{{ $t('organisms.ownershipTransfer.section.startLink') }}
				<ArrowRightIcon class="size-3.5 fill-current" aria-hidden="true" />
			</Anchor>
		</div>
	</ProfileSection>
</template>
<script setup lang="ts">
import ArrowRightIcon from '~/components/icons/ArrowRightIcon.vue';
import CrownIcon from '~/components/icons/CrownIcon.vue';

const localePath = useLocalePath();
const { invitation, isLoaded, hasError, load } = usePendingOwnershipTransfer();

onMounted(load);
</script>
