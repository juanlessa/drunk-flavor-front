<template>
	<Story title="Atoms/Button">
		<template #controls="{ state }: { state: State }">
			<HstSelect v-model="state.size" title="size" :options="buttonSizeOptions" />
			<HstSelect v-model="state.type" title="type" :options="buttonTypeOptions" />
			<HstText v-model="state.value" title="value" />
			<HstCheckbox v-model="state.disabled" title="disabled" />
		</template>

		<Variant title="Primary" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Button
					variant="primary"
					:size="state.size"
					:disabled="state.disabled"
					:type="state.type">
					{{ state.value }}
				</Button>
			</template>
		</Variant>

		<Variant title="Secondary" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Button
					variant="secondary"
					:size="state.size"
					:disabled="state.disabled"
					:type="state.type">
					{{ state.value }}
				</Button>
			</template>
		</Variant>

		<Variant title="Delete" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Button
					variant="delete"
					:size="state.size"
					:disabled="state.disabled"
					:type="state.type">
					{{ state.value }}
				</Button>
			</template>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import type { ButtonSize, ButtonType } from './Button.types';
import { buttonSizeOptions, buttonTypeOptions } from './Button.constants';

type State = {
	size: ButtonSize;
	disabled: boolean;
	type: ButtonType;
	value: string;
};
function initState(): State {
	return {
		size: 'md',
		type: 'button',
		disabled: false,
		value: 'button'
	};
}
</script>
