<template>
	<Story title="Molecules/FormSection">
		<template #controls="{ state }">
			<HstText v-model="(state as State).title" title="title" />
			<HstText v-model="(state as State).description" title="description" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="max-w-3xl p-4 bg-surface-sunken">
					<FormSection
						:title="(state as State).title"
						:description="(state as State).description">
						<InputWrapper>
							<template #label><Label for="story-name">name</Label></template>
							<InputText id="story-name" model-value="milliliter" />
						</InputWrapper>
					</FormSection>
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	title: string;
	description: string;
};

function initState(): State {
	return {
		title: 'Names',
		description: 'Singular and plural, as shown next to a quantity.'
	};
}
</script>
