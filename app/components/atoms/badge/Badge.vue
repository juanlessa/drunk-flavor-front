<template>
	<span :class="badgeStyles({ tone: props.tone })">
		<slot>{{ props.value }}</slot>
	</span>
</template>
<script setup lang="ts">
import { tv } from '~/utils/tv';
import type { BadgeTone } from './Badge.types';

const props = defineProps({
	value: { type: String, default: '' },
	tone: { type: String as PropType<BadgeTone>, default: 'neutral' }
});

const badgeStyles = tv({
	base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium whitespace-nowrap',
	variants: {
		tone: {
			accent: 'bg-accent-subtle text-accent-content',
			success: 'bg-success-surface text-success',
			warning: 'bg-warning-surface text-warning',
			danger: 'bg-danger-surface text-danger',
			neutral: 'bg-surface-control text-content-muted'
		}
	},
	defaultVariants: {
		tone: 'neutral'
	}
});
</script>
