<template>
	<!-- Title block shared by every auth page; status pages add an icon above the title. -->
	<header class="flex flex-col items-center gap-2 text-center">
		<div v-if="$slots.icon" :class="iconStyles({ tone: props.tone })" aria-hidden="true">
			<slot name="icon"></slot>
		</div>
		<Heading as="h1" size="headlineSm">{{ props.title }}</Heading>
		<Text v-if="props.description" class="text-content-muted">{{ props.description }}</Text>
	</header>
</template>
<script setup lang="ts">
import { tv } from '~/utils/tv';

const props = defineProps({
	title: { type: String, required: true },
	description: { type: String, default: '' },
	/** Colour of the optional icon badge. */
	tone: { type: String as PropType<'accent' | 'success' | 'danger'>, default: 'accent' }
});

const iconStyles = tv({
	base: 'mb-2 size-12 shrink-0 rounded-full flex items-center justify-center [&>svg]:size-6 [&>svg]:fill-current',
	variants: {
		tone: {
			accent: 'bg-accent-subtle text-accent-content',
			success: 'bg-success-surface text-success',
			danger: 'bg-danger-surface text-danger'
		}
	}
});
</script>
