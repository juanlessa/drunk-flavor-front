<template>
	<!-- Fills the whole grid row, whatever the column count. -->
	<div
		v-if="props.variant === 'header'"
		class="col-span-full h-full flex flex-col justify-end gap-0.5 pb-1">
		<h2 class="text-body font-bold text-content">
			{{ $t(`molecules.managementGroupRow.${props.group}.title`) }}
		</h2>
		<p class="text-body-sm text-content-muted">
			{{ $t(`molecules.managementGroupRow.${props.group}.description`) }}
		</p>
	</div>
	<div
		v-else
		class="col-span-full h-full flex items-center justify-between gap-3 px-4 rounded-control-card border border-dashed border-stroke text-content-muted">
		<p class="min-w-0 text-body-sm">
			{{ $t('molecules.managementGroupRow.emptyOwn.message') }}
		</p>
		<Button size="sm" variant="outline" class="shrink-0" @click="emit('create')">
			{{ props.createLabel }}
		</Button>
	</div>
</template>
<script setup lang="ts">
import type { ManagementGroup } from '~/helpers/managementGroups.helpers';

const props = defineProps({
	/** `header` introduces a group; `empty-own` tells the user they have not created anything yet. */
	variant: {
		type: String as PropType<'header' | 'empty-own'>,
		required: true
	},
	/** Group introduced by the `header` variant. */
	group: {
		type: String as PropType<ManagementGroup>,
		default: 'own'
	},
	/** Label of the create action of the `empty-own` variant. */
	createLabel: {
		type: String,
		default: ''
	}
});

const emit = defineEmits<{
	(e: 'create'): void;
}>();
</script>
