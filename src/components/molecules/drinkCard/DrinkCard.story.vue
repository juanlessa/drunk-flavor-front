<template>
	<Story title="Molecules/DrinkCard">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.title" title="title" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<DrinkCard
					:title="state.title"
					:categories="state.categories"
					:ingredients="state.ingredients" />
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	title: string;
	categories: string[];
	ingredients: string[];
};
function initState(): State {
	return {
		title: 'Drink title',
		categories: ['Juice', 'Soft drink', 'fruit'],
		ingredients: ['15 ml of Orange Juice', '60 ml of soda', '15 ml of lime']
	};
}
</script>
