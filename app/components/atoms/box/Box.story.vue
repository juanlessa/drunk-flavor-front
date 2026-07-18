<template>
	<Story title="Atoms/Box">
		<template #controls="{ state }">
			<HstSelect
				v-model="(state as State).direction"
				title="direction"
				:options="['row', 'col', 'responsive']" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4">
					<Box :direction="(state as State).direction" class="gap-4">
						<div class="p-4 bg-blue-100 rounded-md">Item 1</div>
						<div class="p-4 bg-blue-100 rounded-md">Item 2</div>
						<div class="p-4 bg-blue-100 rounded-md">Item 3</div>
					</Box>
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	direction: 'row' | 'col' | 'responsive';
};

function initState(): State {
	return {
		direction: 'responsive'
	};
}
</script>
