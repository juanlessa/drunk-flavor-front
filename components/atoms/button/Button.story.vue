<template>
	<Story title="Atoms/Button">
		<template #controls="{ state }: { state: State }">
			<HstSelect v-model="state.size" title="Size" :options="buttonSizeOptions" />
			<HstCheckbox v-model="state.disabled" title="Disabled" />
		</template>

		<Variant title="Primary" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Button variant="primary" :size="state.size" :disabled="state.disabled">
					submit
				</Button>
			</template>
		</Variant>

		<Variant title="Secondary" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Button variant="secondary" :size="state.size" :disabled="state.disabled">
					cancel
				</Button>
			</template>
		</Variant>

		<Variant title="Delete" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Button variant="delete" :size="state.size" :disabled="state.disabled">
					delete
				</Button>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import { buttonSizeOptions, type ButtonSize } from './Button';

type State = {
	size: ButtonSize;
	disabled: boolean;
};
function initState(): State {
	return {
		size: 'md',
		disabled: false
	};
}
</script>
