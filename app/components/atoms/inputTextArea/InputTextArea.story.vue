<template>
	<Story title="Atoms/InputTextArea">
		<template #controls="{ state }">
			<HstText v-model="(state as State).placeholder" title="placeholder" />
			<HstCheckbox v-model="(state as State).hasError" title="has error" />
			<HstCheckbox v-model="(state as State).border" title="border" />
			<HstNumber v-model="(state as State).rows" title="rows" />
			<HstText v-model="(state as State).id" title="id" />
			<HstText v-model="(state as State).name" title="name" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<InputTextArea
					:id="(state as State).id"
					v-model="(state as State).modelValue"
					:name="(state as State).name"
					:rows="(state as State).rows"
					:has-error="(state as State).hasError"
					:border="(state as State).border"
					:placeholder="(state as State).placeholder" />
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	modelValue: string;
	id: string;
	name: string;
	rows: number;
	hasError: boolean;
	border: boolean;
	placeholder: string;
};

function initState(): State {
	return {
		modelValue: '',
		id: '',
		name: '',
		rows: 6,
		hasError: false,
		border: false,
		placeholder: ''
	};
}
</script>
