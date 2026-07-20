<template>
	<Story title="Atoms/InputNumber">
		<template #controls>
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<InputNumber
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
			</div>
		</Variant>

		<Variant title="suffix">
			<div class="p-4">
				<InputNumber
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
					suffix="ml"
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
			</div>
		</Variant>

		<Variant title="suffix-outside">
			<div class="p-4">
				<InputNumber
					:id="state.id"
					v-model="state.modelValue"
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

const state = reactive({
	modelValue: '',
	id: '',
	name: '',
	hasError: false,
	border: false,
	placeholder: ''
});
</script>
