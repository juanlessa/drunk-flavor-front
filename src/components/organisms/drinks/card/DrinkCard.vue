<template>
	<HoverCard side="right" :side-offset="8">
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
		<Card rounded="md" class="p-4">
			<Heading>{{ props.title }}</Heading>
		</Card>
	</HoverCard>
</template>
<script setup lang="ts">
const props = defineProps({
	title: { type: String, default: '' },
	categories: { type: Array as PropType<string[]>, default: () => [] },
	ingredients: { type: Array as PropType<string[]>, default: () => [] }
});
</script>
