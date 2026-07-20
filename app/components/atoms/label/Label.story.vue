<template>
	<Story title="Atoms/Label">
		<template #controls>
			<HstText v-model="state.value" title="value" />
			<HstText v-model="state.for" title="for" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<Label :for="state.for">{{ state.value }}</Label>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	value: 'sample label *',
	for: ''
});
</script>
