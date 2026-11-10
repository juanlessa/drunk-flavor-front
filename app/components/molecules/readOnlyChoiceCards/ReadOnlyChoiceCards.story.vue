<template>
	<Story title="Molecules/ReadOnlyChoiceCards">
		<Variant title="second chosen">
			<div class="p-4 max-w-2xl">
				<ReadOnlyChoiceCards
					model-value="branded"
					:options="options"
					label="ingredient type" />
			</div>
		</Variant>
		<Variant title="first chosen">
			<div class="p-4 max-w-2xl">
				<ReadOnlyChoiceCards
					model-value="generic"
					:options="options"
					label="ingredient type" />
			</div>
		</Variant>
	</Story>
</template>
<script setup lang="ts">
const options = [
	{
		value: 'generic',
		label: 'Any brand',
		description: 'Generic, like blue curaçao or triple sec.'
	},
	{ value: 'branded', label: 'Specific brand', description: 'Needs one product, like Licor 43.' }
];
</script>
