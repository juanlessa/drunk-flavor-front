<template>
	<HoverCard>
		<template #trigger>
			<Card rounded="md" class="p-2 flex gap-4">
				<Thumbnail />
				<div>
					<Heading>{{ props.title }}</Heading>
					<div class="flex gap-2">
						<Text v-for="(category, index) in props.categories" :key="index">
							{{ category }}
						</Text>
					</div>
				</div>
			</Card>
		</template>
		<Card rounded="px">
			<div class="flex flex-col">
				<Text v-for="(ingredient, index) in props.ingredients" :key="index">
					{{ ingredient }}
				</Text>
			</div>
		</Card>
	</HoverCard>
</template>
<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	categories: {
		type: Array as PropType<string[]>,
		default: () => []
	},
	ingredients: {
		type: Array as PropType<string[]>,
		default: () => []
	}
});
</script>
