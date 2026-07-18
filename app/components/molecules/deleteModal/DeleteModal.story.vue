<template>
	<Story title="Molecules/DeleteModal">
		<template #controls="{ state }">
			<HstCheckbox v-model="(state as State).open" title="open" />
			<HstText v-model="(state as State).title" title="title" />
			<HstText v-model="(state as State).description" title="description" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4">
					<Button @click="(state as State).open = true">Open Modal</Button>
					<DeleteModal
						:open="(state as State).open"
						:title="(state as State).title"
						:description="(state as State).description"
						@update:open="(val) => ((state as State).open = val)"
						@cancel="(state as State).open = false"
						@delete="(state as State).open = false" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	open: boolean;
	title: string;
	description: string;
};

function initState(): State {
	return {
		open: false,
		title: 'Delete this item?',
		description: 'This action cannot be undone.'
	};
}
</script>
