<template>
	<div class="w-full flex items-center gap-3">
		<div :class="inputTextContainerStyle({ hasError: props.hasError, border: props.border })">
			<input
				:id="props.id"
				:value="props.modelValue"
				class="flex-1 py-1 text-md leading-base font-normal outline-hidden border-none text-black dark:text-white bg-transparent placeholder-gray-500"
				:type="props.type"
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
import type { InputTextType } from './InputText.types';

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	type: { type: String as PropType<InputTextType>, default: 'text' },
	name: { type: String, default: undefined },
	id: { type: String, default: undefined },
	placeholder: { type: String, default: undefined },
	pattern: { type: String, default: undefined },
	suffix: { type: String, default: '' },
	suffixOutside: { type: Boolean, default: false },
	border: { type: Boolean, default: false },
	hasError: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
	(e: 'blur'): void;
}>();

const handleUpdateInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};

const handleBlurInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	emit('update:modelValue', target.value);
	emit('blur');
};

const inputTextContainerStyle = tv({
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
@reference "~/styles/global.css";

.input-container-focus-border:has(> input:focus) {
	@apply border-black dark:border-white;
}
</style>
