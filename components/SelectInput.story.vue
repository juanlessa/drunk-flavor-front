<template>
	<Story title="Atoms/SelectInput">
		<template #controls="{ state }">
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-3">
					<SelectInput
						:id="state.id"
						v-model="selectedOption"
						:name="state.name"
						:placeholder="state.placeholder"
						:has-error="state.hasError"
						:border="state.border"
						:options="selectInputOptions" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { SelectInputOption } from '~/types/SelectInput';

const selectInputOptions: SelectInputOption[] = [
	{ label: 'Juice', value: '1' },
	{ label: 'Soft drink', value: '2' },
	{ label: 'Syrup', value: '3' }
];

const selectedOption = ref('');

function initState() {
	return {
		id: '',
		name: '',
		hasError: false,
		border: false,
		placeholder: 'select'
	};
}
</script>
