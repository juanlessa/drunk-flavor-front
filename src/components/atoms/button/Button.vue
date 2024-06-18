<template>
	<button
		:class="buttonStyles({ variant: props.variant, size: props.size })"
		:disabled="props.disabled"
		:type="props.type">
		<slot>
			{{ props.value }}
		</slot>
	</button>
</template>

<script setup lang="ts">
import { tv } from 'tailwind-variants';
import type { ButtonSize, ButtonType, ButtonVariant } from '~/types/Button';

const buttonStyles = tv({
	base: 'w-full max-w-80 tablet:max-w-64 rounded-full font-normal text-center px-4 disabled:cursor-not-allowed',
	variants: {
		variant: {
			primary: 'bg-blue-700 hover:bg-blue-500 disabled:bg-blue-400 text-white',
			secondary: 'bg-gray-300  hover:bg-gray-100 disabled:bg-gray-100 text-black',
			delete: 'bg-red-600 hover:bg-red-400 disabled:bg-red-300  text-white'
		},
		size: {
			sm: 'py-1 text-sm',
			md: 'py-2 text-md'
		}
	}
});

const props = defineProps({
	value: {
		type: String,
		default: ''
	},
	variant: {
		type: String as PropType<ButtonVariant>,
		default: 'primary'
	},
	size: {
		type: String as PropType<ButtonSize>,
		default: 'md'
	},
	type: {
		type: String as PropType<ButtonType>,
		default: 'button'
	},
	disabled: {
		type: Boolean,
		default: false
	}
});
</script>
<style></style>
