<template>
	<Story title="Atoms/Label">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.value" title="value" />
			<HstText v-model="state.for" title="for" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Label :for="state.for">{{ state.value }}</Label>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	for: string;
	value: string;
};
function initState(): State {
	return {
		for: '',
		value: 'sample label *'
	};
}
</script>
