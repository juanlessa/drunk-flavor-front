<template>
	<fieldset :disabled="props.disabled">
		<legend class="sr-only">{{ props.label }}</legend>
		<div class="inline-flex items-center gap-1" @pointerleave="previewValue = undefined">
			<label
				v-for="value in ratingValues"
				:key="value"
				class="size-11 inline-flex items-center justify-center rounded-icon-action cursor-pointer touch-manipulation transition-transform duration-short active:scale-95 focus-within:shadow-focus-ring-flat has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-disabled"
				@pointerenter="handlePointerEnter($event, value)">
				<input
					class="sr-only"
					type="radio"
					:checked="props.modelValue === value"
					:value="value"
					:name="props.name"
					:aria-label="props.valueLabels[value - 1]"
					@change="emit('update:modelValue', value)" />
				<StarIcon
					class="size-8"
					:class="value <= displayedValue ? 'text-rating' : 'text-rating-empty'" />
			</label>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import { RATING_MAX_VALUE, RATING_MIN_VALUE } from '~/domain/rating/rating.constants';

const props = defineProps({
	modelValue: { type: Number, default: 0 },
	name: { type: String, required: true },
	label: { type: String, required: true },
	valueLabels: { type: Array as PropType<string[]>, required: true },
	disabled: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: number): void;
}>();

const previewValue = ref<number>();
const ratingValues = Array.from(
	{ length: RATING_MAX_VALUE - RATING_MIN_VALUE + 1 },
	(_, index) => index + RATING_MIN_VALUE
);
const displayedValue = computed(() => previewValue.value ?? props.modelValue);

const handlePointerEnter = (event: PointerEvent, value: number) => {
	if (event.pointerType === 'touch' || props.disabled) return;
	previewValue.value = value;
};
</script>
