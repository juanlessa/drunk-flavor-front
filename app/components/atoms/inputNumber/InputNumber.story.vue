<template>
	<Story title="Atoms/InputNumber">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<InputNumber
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
			</template>
		</Variant>

		<Variant title="sufix" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<InputNumber
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
					suffix="ml"
					:has-error="state.hasError"
					:border="state.border"
					:placeholder="state.placeholder" />
			</template>
		</Variant>

		<Variant title="sufix-outside" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<InputNumber
					:id="state.id"
					v-model="state.modelValue"
					:name="state.name"
					suffix="ml"
					suffix-outside
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
		placeholder: ''
	};
}
</script>
