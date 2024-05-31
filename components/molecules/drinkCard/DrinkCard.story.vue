<template>
	<Story title="Molecules/DrinkCard">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.title" title="title" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<DrinkCard :title="state.title" />
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	title: string;
};
function initState(): State {
	return {
		title: 'some title'
	};
}
</script>
