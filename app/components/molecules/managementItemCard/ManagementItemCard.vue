<template>
	<div :class="managementItemCardStyle()" :style="managementItemCardDimensions">
		<!-- The content and the delete action are sibling buttons: nesting them would be invalid HTML. -->
		<button
			type="button"
			:class="
				managementItemCardContentStyle({
					media: !!$slots.media,
					class: 'text-left rounded-l-control-card cursor-pointer focus-visible:outline-hidden focus-visible:shadow-focus-ring'
				})
			"
			@click="emit('select')">
			<!-- Optional leading visual (e.g. a drink thumbnail); decorative next to the title. -->
			<slot name="media"></slot>
			<span class="min-w-0 flex flex-col">
				<span class="block truncate text-body text-content">{{ props.title }}</span>
				<span
					v-if="props.description"
					class="block truncate text-body-sm text-content-muted">
					{{ props.description }}
				</span>
			</span>
		</button>
		<button
			type="button"
			class="inline-flex shrink-0 size-8 items-center justify-center rounded-icon-action text-content-muted cursor-pointer transition-colors duration-short hover:bg-danger-surface hover:text-danger focus-visible:outline-hidden focus-visible:shadow-focus-ring"
			:aria-label="
				$t('molecules.managementItemCard.deleteButton.label', { name: props.title })
			"
			@click="emit('delete')">
			<TrashIcon class="fill-current" aria-hidden="true" />
		</button>
	</div>
</template>
<script setup lang="ts">
import {
	managementItemCardContentStyle,
	managementItemCardDimensions,
	managementItemCardStyle
} from './ManagementItemCard.styles';

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ''
	}
});

const emit = defineEmits<{
	(e: 'select' | 'delete'): void;
}>();
</script>
