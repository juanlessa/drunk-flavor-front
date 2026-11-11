<template>
	<div class="flex w-full min-w-0 flex-col gap-2">
		<!--
			A form field shown as a value. Same structure, label and text styles as InputWrapper with a text
			input (or a select), and the same height: the box keeps the control's border width and padding,
			but only its bottom border shows. Use it inside a <dl>.
		-->
		<dt class="text-body font-regular text-content">{{ props.label }}</dt>
		<dd
			class="min-w-0 py-1 wrap-break-word text-body font-regular control-border-width border-transparent border-b-stroke"
			:class="props.value || $slots.default ? 'text-content' : 'text-content-muted'">
			<slot>{{ props.value || '—' }}</slot>
		</dd>
		<dd v-if="props.help" class="text-body-sm text-content-muted">{{ props.help }}</dd>
		<!-- What the form shows under its input (e.g. a list), spaced like it. -->
		<dd v-if="$slots.after" class="mt-1">
			<slot name="after" />
		</dd>
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	label: { type: String, required: true },
	/** The value, styled like the text typed in an input. An empty value shows a dash. */
	value: { type: String, default: '' },
	/** The help the form shows under the field. */
	help: { type: String, default: '' }
});
</script>
