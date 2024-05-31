<template>
	<Story title="Atoms/ErrorMessage">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.value" title="value" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<ErrorMessage>{{ state.value }}</ErrorMessage>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	value: string;
};
function initState(): State {
	return {
		value: 'error message'
	};
}
</script>
