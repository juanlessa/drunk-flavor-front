<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<!-- The same frame and spacing as the record's form, so the page reads like the form it replaces. -->
		<header class="flex flex-col gap-2">
			<Anchor :to="props.backTo" class="inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ props.backLabel }}
			</Anchor>
			<Heading as="h1" size="headlineSm">{{ props.title }}</Heading>
			<!-- Where the form describes the record, the view says why it cannot be edited. -->
			<p role="note" class="flex items-start gap-2 text-body text-accent-content">
				<InfoIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
				<span>{{ $t('organisms.readOnlyFormView.notice') }}</span>
			</p>
		</header>
		<!-- Spaced like Form: the sections, then the buttons further below. -->
		<div class="flex flex-col gap-10">
			<div class="flex flex-col gap-6">
				<slot />
			</div>
			<div class="flex flex-col items-center gap-4 tablet:flex-row tablet:justify-end">
				<Button variant="secondary" class="tablet:w-auto" @click="emit('back')">
					<span class="inline-flex items-center gap-2">
						<ArrowLeftIcon class="size-4" aria-hidden="true" />
						{{ $t('organisms.readOnlyView.backButton', { section: props.backLabel }) }}
					</span>
				</Button>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
import InfoIcon from '~/components/icons/InfoIcon.vue';

/**
 * Page shell of a record the user can read but not change, laid out like the record's form: back
 * link, title (the record's name), the reason it is read-only, the sections (slot) and a single way out.
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
