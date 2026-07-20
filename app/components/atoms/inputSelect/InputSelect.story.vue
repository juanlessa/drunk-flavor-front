<template>
	<Story title="Atoms/InputSelect">
		<template #controls>
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<InputSelect
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
					:placeholder="state.placeholder"
					:has-error="state.hasError"
					:border="state.border"
					:options="sampleOptions" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { InputSelectOption } from './InputSelect.types';

const sampleOptions: InputSelectOption[] = [
	{ label: 'item 1', value: '1' },
	{ label: 'item 2', value: '2' },
	{ label: 'item 3', value: '3' }
];

const state = reactive({
	modelValue: '',
	id: '',
	name: '',
	hasError: false,
	border: false,
	placeholder: 'select'
});
</script>
