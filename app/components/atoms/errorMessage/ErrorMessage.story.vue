<template>
	<Story title="Atoms/ErrorMessage">
		<template #controls>
			<HstText v-model="state.value" title="value" />
		</template>

		<Variant title="default">
			<ErrorMessage>{{ state.value }}</ErrorMessage>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	value: 'error message'
});
</script>
