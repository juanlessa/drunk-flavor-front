<template>
	<Story title="Atoms/InputWrapper">
		<template #controls="{ state }">
			<HstSelect
				v-model="(state as State).direction"
				title="direction"
				:options="['column', 'row']" />
			<HstCheckbox v-model="(state as State).showError" title="show error" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4 max-w-80">
					<InputWrapper :direction="(state as State).direction">
						<template #label>
							<Label for="demo-input">Username</Label>
						</template>
						<InputText id="demo-input" placeholder="Enter username" />
						<template v-if="(state as State).showError" #error>
							<ErrorMessage value="This field is required" />
						</template>
					</InputWrapper>
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	direction: 'column' | 'row';
	showError: boolean;
};

function initState(): State {
	return {
		direction: 'column',
		showError: false
	};
}
</script>
