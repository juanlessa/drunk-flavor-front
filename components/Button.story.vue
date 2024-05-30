<template>
	<Story title="Atoms/Button">
		<template #controls="{ state }">
			<HstSelect v-model="state.size" title="Size" :options="buttonSizeOptions" />
			<HstCheckbox v-model="state.disabled" title="Disabled" />
		</template>

		<Variant title="Primary" :init-state="initState">
			<template #default="{ state }">
				<Button variant="primary" :size="state.size" :disabled="state.disabled">
					primary
				</Button>
			</template>
		</Variant>

		<Variant title="Secondary" :init-state="initState">
			<template #default="{ state }">
				<Button variant="secondary" :size="state.size" :disabled="state.disabled">
					cancel
				</Button>
			</template>
		</Variant>

		<Variant title="Delete" :init-state="initState">
			<template #default="{ state }">
				<Button variant="delete" :size="state.size" :disabled="state.disabled">
					delete
				</Button>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
const buttonSizeOptions = ['sm', 'md'];

function initState() {
	return {
		size: 'md',
		disabled: false
	};
}
</script>
