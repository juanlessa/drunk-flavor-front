<template>
	<Story title="Molecules/DropZone">
		<template #controls>
			<HstText v-model="state.maxFileSizeLabel" title="max file size (MB)" />
		</template>

		<Variant title="images only (default)">
			<div class="p-4 max-w-96">
				<DropZone v-model="state.file" :max-file-size="maxFileSizeBytes" />
			</div>
		</Variant>

		<Variant title="all types">
			<div class="p-4 max-w-96">
				<DropZone
					v-model="state.file"
					:accept="dropZoneAcceptOptions"
					:max-file-size="maxFileSizeBytes" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { dropZoneAcceptOptions } from './DropZone.constants';

const state = reactive({
	file: undefined as File | undefined,
	maxFileSizeLabel: '5'
});

const maxFileSizeBytes = computed(() => Number(state.maxFileSizeLabel) * 1024 * 1024);
</script>
