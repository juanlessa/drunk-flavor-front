<template>
	<Story title="Molecules/InputWrapper">
		<template #controls>
			<HstSelect
				v-model="state.direction"
				title="direction"
				:options="inputWrapperDirectionOptions" />
			<HstCheckbox v-model="state.showError" title="show error" />
		</template>

		<Variant title="default">
			<div class="p-4 max-w-80">
				<InputWrapper :direction="state.direction">
					<template #label>
						<Label for="demo-input">Username</Label>
					</template>
					<InputText id="demo-input" placeholder="Enter username" />
					<template v-if="state.showError" #error>
						<ErrorMessage value="This field is required" />
					</template>
				</InputWrapper>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { InputWrapperDirection } from './InputWrapper.types';
import { inputWrapperDirectionOptions } from './InputWrapper.constants';

const state = reactive({
	direction: 'col' as InputWrapperDirection,
	showError: false
});
</script>
