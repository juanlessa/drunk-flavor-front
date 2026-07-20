<template>
	<Story title="Atoms/InputText">
		<template #controls>
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstSelect v-model="state.type" title="type" :options="inputTextTypeOptions" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<InputText
					:id="state.id"
					v-model="state.modelValue"
					:type="state.type"
					:name="state.name"
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
			</div>
		</Variant>

		<Variant title="suffix">
			<div class="p-4">
				<InputText
					:id="state.id"
					v-model="state.modelValue"
					:type="state.type"
					:name="state.name"
					suffix="ml"
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
			</div>
		</Variant>

		<Variant title="suffix-outside">
			<div class="p-4">
				<InputText
					:id="state.id"
					v-model="state.modelValue"
					:type="state.type"
					:name="state.name"
					suffix="ml"
					suffix-outside
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { InputTextType } from './InputText.types';
import { inputTextTypeOptions } from './InputText.constants';

const state = reactive({
	modelValue: '',
	id: '',
	name: '',
	type: 'text' as InputTextType,
	hasError: false,
	border: false,
	placeholder: ''
});
</script>
