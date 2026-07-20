<template>
	<Story title="Atoms/Search">
		<template #controls>
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstText v-model="state.noResult" title="no result text" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default">
			<div class="p-4 min-h-60">
				<Search
					:id="state.id"
					:name="state.name"
					:placeholder="state.placeholder"
					:no-result="state.noResult"
					:has-error="state.hasError"
					:border="state.border"
					:options="sampleOptions" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { InputSelectOption } from '../inputSelect/InputSelect.types';

const sampleOptions: InputSelectOption[] = [
	{ label: 'Vodka', value: '1' },
	{ label: 'Rum', value: '2' },
	{ label: 'Gin', value: '3' },
	{ label: 'Tequila', value: '4' },
	{ label: 'Whiskey', value: '5' }
];

const state = reactive({
	id: '',
	name: '',
	hasError: false,
	border: false,
	placeholder: 'search...',
	noResult: 'no results'
});
</script>
