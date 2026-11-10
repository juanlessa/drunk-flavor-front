<template>
	<Story title="Molecules/SortSelect">
		<Variant title="default">
			<div class="p-4 flex justify-end h-72">
				<div class="w-72">
					<SortSelect v-model="value" label="Sort by" :options="options" />
				</div>
			</div>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
const value = ref('rating');
const options = [
	{ label: 'Best rated', value: 'rating' },
	{ label: 'Name (A–Z)', value: 'name' },
	{ label: 'Newest', value: 'recent' }
];
</script>
