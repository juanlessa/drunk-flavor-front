<template>
	<!-- A label and its value as plain text: same place and label as the form field, nothing to edit. -->
	<div class="flex min-w-0 flex-col gap-1 border-b border-stroke pb-2">
		<dt class="text-caption text-content-muted">{{ props.label }}</dt>
		<dd class="min-w-0 wrap-break-word text-body font-bold text-content">
			<slot>
				<Badge
					v-if="props.flag !== undefined"
					:tone="props.flag ? 'success' : 'neutral'"
					:value="
						props.flag
							? `✓ ${$t('molecules.readOnlyField.yes')}`
							: $t('molecules.readOnlyField.no')
					" />
				<template v-else>{{ props.value || '—' }}</template>
			</slot>
		</dd>
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	label: { type: String, required: true },
	/** Plain text value. An empty value shows a dash. */
	value: { type: String, default: '' },
	/** Shows a yes/no badge instead of text. */
	flag: { type: Boolean, default: undefined }
});
</script>
