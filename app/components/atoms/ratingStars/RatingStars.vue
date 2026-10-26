<template>
	<div class="inline-flex items-center gap-1" role="img" :aria-label="props.label">
		<span
			v-for="(fill, index) in starFills"
			:key="index"
			class="relative inline-flex shrink-0"
			:class="starSizeClass">
			<StarIcon class="absolute inset-0 text-rating-empty" />
			<span
				class="absolute inset-y-0 left-0 overflow-hidden"
				:style="{ width: `${fill}%` }"
				aria-hidden="true">
				<StarIcon class="max-w-none text-rating" :class="starSizeClass" />
			</span>
		</span>
	</div>
</template>

<script setup lang="ts">
import { RATING_MAX_VALUE } from '~/domain/rating/rating.constants';

type RatingStarsSize = 'sm' | 'md' | 'lg';

const props = defineProps({
	value: { type: Number, required: true },
	max: { type: Number, default: RATING_MAX_VALUE },
	size: { type: String as PropType<RatingStarsSize>, default: 'md' },
	label: { type: String, required: true }
});

const starSizeClass = computed(() => {
	if (props.size === 'sm') return 'size-5';
	if (props.size === 'lg') return 'size-8';
	return 'size-6';
});

const starFills = computed(() =>
	Array.from({ length: props.max }, (_, index) => {
		const fill = Math.min(Math.max(props.value - index, 0), 1);
		return fill * 100;
	})
);
</script>
