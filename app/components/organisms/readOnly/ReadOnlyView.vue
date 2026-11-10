<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header class="flex flex-col gap-2">
			<Anchor :to="props.backTo" class="inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ props.backLabel }}
			</Anchor>
			<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
				<Heading as="h1" size="headlineSm">{{ props.title }}</Heading>
				<span
					class="inline-flex items-center gap-1 rounded-full border border-stroke bg-surface px-2.5 py-0.5 text-caption font-medium text-content-muted">
					<LockIcon class="size-3.5" aria-hidden="true" />
					{{ $t('organisms.readOnlyView.badge') }}
				</span>
			</div>
		</header>
		<div
			role="note"
			class="flex items-start gap-3 rounded-md bg-accent-subtle px-4 py-3 text-body-sm text-accent-content">
			<InfoIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
			<p>{{ $t('organisms.readOnlyView.notice') }}</p>
		</div>
		<div class="flex flex-col gap-6">
			<slot />
		</div>
		<div>
			<Button variant="outline" @click="emit('back')">
				<span class="inline-flex items-center gap-2">
					<ArrowLeftIcon class="size-4" aria-hidden="true" />
					{{ $t('organisms.readOnlyView.backButton', { section: props.backLabel }) }}
				</span>
			</Button>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
import InfoIcon from '~/components/icons/InfoIcon.vue';
import LockIcon from '~/components/icons/LockIcon.vue';

/**
 * Page shell of a record the user can read but not change: back link, title with a read-only badge,
 * the reason, the sections (slot), and a single way out. There is no save or cancel.
 */
const props = defineProps({
	title: { type: String, required: true },
	/** Where the back link goes (the list). */
	backTo: { type: [String, Object] as PropType<RouteLocationRaw>, required: true },
	/** Name of the list, used by the back link and the back button. */
	backLabel: { type: String, required: true }
});

const emit = defineEmits<{
	(e: 'back'): void;
}>();
</script>
