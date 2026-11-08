<template>
	<Story title="Molecules/RadioCardGroup">
		<template #controls="{ state }">
			<HstSelect v-model="(state as State).value" title="value" :options="valueOptions" />
		</template>
		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="max-w-xl p-4 bg-surface-sunken">
					<RadioCardGroup
						id="story-kind"
						label="Ingredient type"
						:options="options"
						:model-value="(state as State).value"
						@update:model-value="(value) => ((state as State).value = value)" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = { value: string };

const valueOptions = ['', 'generic', 'branded'];
const options = [
	{
		value: 'generic',
		label: 'Any brand',
		description: 'Generic, like blue curaçao or triple sec.'
	},
	{ value: 'branded', label: 'Specific brand', description: 'Needs one product, like Licor 43.' }
];

function initState(): State {
	return { value: 'generic' };
}
</script>
