<template>
	<Story title="Molecules/Form">
		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Form>
					<Heading>Form</Heading>
					<Text>this is a form</Text>
					<InputText v-model="state.inputModelValue" />
				</Form>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	inputModelValue: string;
};

function initState(): State {
	return {
		inputModelValue: ''
	};
}
</script>
