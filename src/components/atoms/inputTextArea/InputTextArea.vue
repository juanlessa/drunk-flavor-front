<template>
	<Textarea
		:id="props.id"
		:value="props.modelValue"
		:class="textAreaStyle({ hasError: props.hasError, border: props.border })"
		:name="props.name"
		:placeholder="props.placeholder"
		:rows="props.rows"
		@input="handleUpdateInput"
		@blur="handleBlurInput"></Textarea>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: ''
	},
	id: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: ''
	},
	rows: {
		type: Number,
		default: 6
	},
	border: {
		type: Boolean,
		default: false
	},
	hasError: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
	(e: 'blur'): void;
}>();

const handleUpdateInput = (event: Event) => {
	const inputElement = event.target as HTMLTextAreaElement;
	emit('update:modelValue', inputElement.value);
};

const handleBlurInput = (event: Event) => {
	const inputElement = event.target as HTMLTextAreaElement;
	emit('update:modelValue', inputElement.value);
	emit('blur');
};

const textAreaStyle = tv({
	base: 'w-full py-1 px-3 rounded-md box-border border-2  bg-gray-200 border-gray-200 dark:bg-gray-800 dark:border-gray-800 text-black dark:text-white placeholder-gray-500',
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
