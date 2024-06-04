<template>
	<Story title="Atoms/SelectInput">
		<template #controls="{ state }: { state: State }">
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<div class="p-3">
					<SelectInput
						:id="state.id"
						v-model="state.modelValue"
						:name="state.name"
						:placeholder="state.placeholder"
						:has-error="state.hasError"
						:border="state.border"
						:options="selectInputSampleOptions" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import type { SelectInputOption } from './SelectInput.types';

const selectInputSampleOptions: SelectInputOption[] = [
	{ label: 'Juice', value: '1' },
	{ label: 'Soft drink', value: '2' },
	{ label: 'Syrup', value: '3' }
];

type State = {
	modelValue: string;
	id: string;
	name: string;
	hasError: boolean;
	border: boolean;
	placeholder: string;
};

function initState(): State {
	return {
		modelValue: '',
		id: '',
		name: '',
		hasError: false,
		border: false,
		placeholder: 'select'
	};
}
</script>
