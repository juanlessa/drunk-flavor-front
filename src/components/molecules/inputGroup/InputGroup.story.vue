<template>
	<Story title="Molecules/InputGroup">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.label" title="label" />
			<HstText v-model="state.errorMessage" title="error message" />
			<HstText v-model="state.placeholder" title="placeholder" />
			<HstCheckbox v-model="state.hasError" title="has error" />
			<HstCheckbox v-model="state.border" title="border" />
			<HstSelect v-model="state.type" title="type" :options="textInputTypeOptions" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<InputGroup>
					<template #label>
						<Label :for="state.id">{{ state.label }}</Label>
					</template>

					<TextInput
						:id="state.id"
						v-model="state.modelValue"
						:type="state.type"
						:has-error="state.hasError"
						:border="state.border"
						:placeholder="state.placeholder" />

					<template #error>
						<ErrorMessage>{{ state.errorMessage }}</ErrorMessage>
					</template>
				</InputGroup>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import type { TextInputType } from '~/types/TextInput';
import { textInputTypeOptions } from '~/constants/TextInput';

type State = {
	modelValue: string;
	id: string;
	name: string;
	label: string;
	errorMessage: string;
	type: TextInputType;
	hasError: boolean;
	border: boolean;
	placeholder: string;
};
function initState(): State {
	return {
		modelValue: '',
		label: 'label',
		errorMessage: 'error message',
		id: 'id',
		name: '',
		type: 'text',
		hasError: false,
		border: false,
		placeholder: ''
	};
}
</script>
