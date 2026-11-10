<template>
	<div :class="managementItemCardStyle()" :style="managementItemCardDimensions">
		<!-- The content and the delete action are sibling buttons: nesting them would be invalid HTML. -->
		<component
			:is="props.selectable ? 'button' : 'div'"
			:type="props.selectable ? 'button' : undefined"
			:class="
				managementItemCardContentStyle({
					media: !!$slots.media,
					class: props.selectable
						? 'text-left rounded-l-control-card cursor-pointer focus-visible:outline-hidden focus-visible:shadow-focus-ring'
						: 'text-left'
				})
			"
			@click="props.selectable && emit('select')">
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
		</component>
		<!-- A record the user can read but not change: a lock instead of the delete action. -->
		<span
			v-if="props.readonly"
			role="img"
			class="inline-flex shrink-0 size-8 items-center justify-center text-content-muted"
			:aria-label="$t('molecules.managementItemCard.readonly.label', { name: props.title })">
			<LockIcon class="size-4" aria-hidden="true" />
		</span>
		<button
			v-else
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
	},
	/** The content is a button that emits `select`. Turn it off when there is no page to open. */
	selectable: {
		type: Boolean,
		default: true
	},
	/** The user cannot change this record: shows a lock and offers no delete action. */
	readonly: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits<{
	(e: 'select' | 'delete'): void;
}>();
</script>
