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
import type { ButtonSize, ButtonType, ButtonVariant } from './Button.types';

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

const buttonStyles = tv({
	base: 'w-full max-w-80 tablet:max-w-64 rounded-full font-regular text-center px-4 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:shadow-focus-ring',
	variants: {
		variant: {
			primary:
				'bg-accent hover:bg-accent-hover text-content-on-accent disabled:bg-surface-hover disabled:text-content-subtle',
			secondary:
				'bg-surface-input hover:bg-surface-hover text-content disabled:bg-surface-hover disabled:text-content-subtle',
			delete: 'bg-danger-emphasis hover:bg-danger-emphasis-hover text-content-on-accent disabled:bg-surface-hover disabled:text-content-subtle',
			outline:
				'bg-transparent border-2 border-stroke-strong text-content hover:bg-surface-hover disabled:text-content-subtle disabled:border-stroke'
		},
		size: {
			sm: 'py-1 text-body-sm',
			md: 'py-2 text-body'
		}
	}
});
</script>
