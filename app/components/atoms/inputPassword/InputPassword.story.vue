<template>
	<Story title="Atoms/InputPassword">
		<template #controls>
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<InputPassword
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
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
