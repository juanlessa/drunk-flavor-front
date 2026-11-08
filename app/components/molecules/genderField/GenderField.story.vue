<template>
	<Story title="Molecules/GenderField">
		<template #controls="{ state }">
			<HstSelect v-model="(state as State).value" title="value" :options="valueOptions" />
			<HstText v-model="(state as State).error" title="error" />
		</template>
		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="max-w-sm p-4 bg-surface-sunken">
					<GenderField
						id="story-gender"
						:model-value="(state as State).value || undefined"
						:error="(state as State).error"
						@update:model-value="(value) => ((state as State).value = value)" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	value: '' | 'masculine' | 'feminine';
	error: string;
};

const valueOptions = ['', 'masculine', 'feminine'];

function initState(): State {
	return { value: '', error: '' };
}
</script>
