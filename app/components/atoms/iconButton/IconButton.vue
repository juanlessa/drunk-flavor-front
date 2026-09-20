<template>
	<button
		:type="props.type"
		:aria-label="props.ariaLabel"
		:disabled="props.disabled"
		class="inline-flex items-center justify-center rounded-icon-action p-1 cursor-pointer enabled:hover:bg-surface-hover focus-visible:shadow-focus-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-disabled">
		<slot />
	</button>
</template>
<script setup lang="ts">
const props = defineProps({
	ariaLabel: {
		type: String,
		default: 'button'
	},
	type: {
		type: String as PropType<'button' | 'submit' | 'reset'>,
		default: 'button'
	},
	disabled: {
		type: Boolean,
		default: false
	}
});
</script>
