<template>
	<RadioGroupRoot
		:id="props.id"
		:model-value="props.modelValue"
		:name="props.name"
		:aria-label="props.label"
		class="grid grid-cols-1 gap-3 tablet:grid-cols-2"
		@update:model-value="handleUpdate">
		<label
			v-for="option in props.options"
			:key="option.value"
			:for="`${props.id}-${option.value}`"
			:class="cardStyle()">
			<RadioGroupItem
				:id="`${props.id}-${option.value}`"
				:value="option.value"
				class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-stroke-input bg-surface-input outline-hidden data-[state=checked]:border-accent">
				<RadioGroupIndicator class="block size-2.5 rounded-full bg-accent" />
			</RadioGroupItem>
			<span class="flex min-w-0 flex-col gap-0.5">
				<span class="text-body font-medium text-content">{{ option.label }}</span>
				<span v-if="option.description" class="text-body-sm text-content-muted">
					{{ option.description }}
				</span>
			</span>
		</label>
	</RadioGroupRoot>
</template>
<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'radix-vue';
import { tv } from '~/utils/tv';
import type { RadioCardOption } from './RadioCardGroup.types';

const props = defineProps({
	modelValue: { type: String, default: '' },
	options: { type: Array as PropType<RadioCardOption[]>, required: true },
	id: { type: String, required: true },
	name: { type: String, default: undefined },
	/** Names the group for assistive technology; the options alone do not say what is being chosen. */
	label: { type: String, required: true }
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const handleUpdate = (value: string) => emit('update:modelValue', value);

// The whole card is the target (at least 44px tall on a phone); the checked one gets the accent border.
const cardStyle = tv({
	base: 'flex min-h-11 cursor-pointer items-start gap-3 rounded-control border border-stroke-input bg-surface-input p-3 transition-colors duration-short has-[button[data-state=checked]]:border-focus-ring has-[button[data-state=checked]]:bg-accent-subtle has-[button:focus-visible]:shadow-focus-ring'
});
</script>
