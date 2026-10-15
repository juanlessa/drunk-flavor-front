<template>
	<button
		:class="buttonStyles({ variant: props.variant, size: props.size })"
		:aria-label="props.ariaLabel"
		:disabled="props.disabled"
		:type="props.type">
		<slot>
			{{ props.value }}
		</slot>
	</button>
</template>

<script setup lang="ts">
import { tv } from '~/utils/tv';
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
	/**
	 * Accessible name. Mandatory for `icon`, which has no visible text and would
	 * otherwise be announced as just "button" by a screen reader.
	 */
	ariaLabel: {
		type: String,
		default: undefined
	},
	disabled: {
		type: Boolean,
		default: false
	}
});

/**
 * Variants that render as a filled pill. The shape lives in compoundVariants
 * instead of `base` so the bare variants (`icon`, `plain`) never inherit the
 * full width, the pill radius or the horizontal/vertical padding.
 */
const FILLED_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'delete', 'outline'];

const buttonStyles = tv({
	base: 'font-regular enabled:cursor-pointer disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:shadow-focus-ring',
	variants: {
		variant: {
			primary:
				'bg-accent hover:bg-accent-hover text-content-on-accent disabled:bg-surface-hover disabled:text-content-subtle',
			secondary:
				'bg-surface-input hover:bg-surface-hover text-content disabled:bg-surface-hover disabled:text-content-subtle',
			delete: 'bg-danger-emphasis hover:bg-danger-emphasis-hover text-content-on-accent disabled:bg-surface-hover disabled:text-content-subtle',
			outline:
				'bg-surface-transparent border-2 border-stroke-strong text-content hover:bg-surface-hover disabled:text-content-subtle disabled:border-stroke',
			icon: 'inline-flex items-center justify-center p-1 rounded-icon-action enabled:hover:bg-surface-hover disabled:opacity-disabled',
			plain: 'bg-surface-transparent text-content disabled:text-content-subtle'
		},
		size: {
			sm: 'text-body-sm',
			md: 'text-body'
		}
	},
	compoundVariants: [
		{
			variant: FILLED_VARIANTS,
			class: 'w-full max-w-80 tablet:max-w-64 rounded-full text-center px-4'
		},
		{ variant: FILLED_VARIANTS, size: 'sm', class: 'py-1' },
		{ variant: FILLED_VARIANTS, size: 'md', class: 'py-2' }
	]
});
</script>
