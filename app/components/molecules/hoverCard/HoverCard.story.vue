<template>
	<Story title="Molecules/HoverCard">
		<template #controls="{ state }">
			<HstCheckbox v-model="(state as State).open" title="open" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<HoverCard v-model:open="(state as State).open">
					<template #trigger>
						<Text>hover trigger</Text>
					</template>
					<Card>
						<Text>hover content</Text>
					</Card>
				</HoverCard>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	open: boolean;
};
function initState(): State {
	return {
		open: false
	};
}
</script>
