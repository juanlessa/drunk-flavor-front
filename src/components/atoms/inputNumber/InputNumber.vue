<template>
	<div class="flex items-center gap-3">
		<div :class="inputNumberContainerStyle({ hasError: props.hasError, border: props.border })">
			<input
				:id="props.id"
				:value="props.modelValue"
				:class="[
					'py-1 text-md leading-base font-normal outline-none border-none text-black dark:text-white bg-transparent placeholder-gray-500',
					!props.inputWidth && 'flex-1'
				]"
				:style="props.inputWidth ? { width: props.inputWidth } : undefined"
				type="number"
				:name="props.name"
				:placeholder="props.placeholder"
				:pattern="`${props.pattern}`"
				@input="handleUpdateInput"
				@blur="handleBlurInput" />
			<div
				v-if="props.suffix && !props.suffixOutside"
				class="text-base text-normal text-white dark:text-black">
				{{ props.suffix }}
			</div>
		</div>
		<div
			v-if="props.suffix && props.suffixOutside"
			class="text-base text-normal text-black dark:text-white">
			{{ props.suffix }}
		</div>
	</div>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	name: { type: String, default: undefined },
	id: { type: String, default: undefined },
	placeholder: { type: String, default: undefined },
	pattern: { type: String, default: undefined },
	suffix: { type: String, default: '' },
	suffixOutside: { type: Boolean, default: false },
	border: { type: Boolean, default: false },
	hasError: { type: Boolean, default: false },
	/** CSS width value (e.g. '5ch', '4rem', '60px') */
	inputWidth: { type: String, default: undefined }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: number): void;
	(e: 'blur'): void;
}>();

const handleUpdateInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	const value = Number(target.value);
	emit('update:modelValue', value);
};

const handleBlurInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	const value = Number(target.value);
	emit('update:modelValue', value);
	emit('blur');
};

const inputNumberContainerStyle = tv({
	base: 'flex-1 flex items-center gap-2 px-3 rounded-md box-border border-2 bg-gray-200 border-gray-200 dark:bg-gray-800 dark:border-gray-800 input-container-focus-border',
	variants: {
		border: {
			true: 'border-gray-300 dark:border-gray-700'
		},
		hasError: {
			true: 'border-red-400 dark:border-red-600'
		}
	}
});
</script>
<style scoped>
.input-container-focus-border:has(> input:focus) {
	@apply border-black dark:border-white;
}

/* remove arrows or spinners */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
/* end remove arrows or spinners */
</style>
