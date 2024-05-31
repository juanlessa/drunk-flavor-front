<template>
	<HoverCard>
		<template #trigger>
			<Card rounded="md" class="flex gap-4">
				<Thumbnail />
				<div>
					<Heading>{{ props.title }}</Heading>
				</div>
			</Card>
		</template>
		<Card rounded="px">
			<Text>content here </Text>
		</Card>
	</HoverCard>
</template>
<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: ''
	}
});
</script>
