<template>
	<Story title="Atoms/TextArea">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstNumber v-model="state.rows" title="rows" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<TextArea
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
					:rows="state.rows"
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
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
