<template>
	<Story title="Atoms/Button">
		<template #controls>
			<HstSelect v-model="state.size" title="size" :options="buttonSizeOptions" />
			<HstSelect v-model="state.type" title="type" :options="buttonTypeOptions" />
			<HstText v-model="state.value" title="value" />
			<HstCheckbox v-model="state.disabled" title="disabled" />
		</template>

		<Variant title="Primary">
			<Button
				variant="primary"
				:size="state.size"
				:disabled="state.disabled"
				:type="state.type">
				{{ state.value }}
			</Button>
		</Variant>

		<Variant title="Secondary">
			<Button
				variant="secondary"
				:size="state.size"
				:disabled="state.disabled"
				:type="state.type">
				{{ state.value }}
			</Button>
		</Variant>

		<Variant title="Delete">
			<Button
				variant="delete"
				:size="state.size"
				:disabled="state.disabled"
				:type="state.type">
				{{ state.value }}
			</Button>
		</Variant>

		<Variant title="Outline">
			<Button
				variant="outline"
				:size="state.size"
				:disabled="state.disabled"
				:type="state.type">
				{{ state.value }}
			</Button>
		</Variant>

		<Variant title="Icon">
			<div class="p-4">
				<Button
					variant="icon"
					aria-label="delete item"
					:disabled="state.disabled"
					:type="state.type">
					<TrashIcon />
				</Button>
			</div>
		</Variant>

		<Variant title="Plain">
			<div class="p-4">
				<Button
					variant="plain"
					:size="state.size"
					:disabled="state.disabled"
					:type="state.type">
					{{ state.value }}
				</Button>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import TrashIcon from '~/components/icons/TrashIcon.vue';
import type { ButtonSize, ButtonType } from './Button.types';
import { buttonSizeOptions, buttonTypeOptions } from './Button.constants';

const state = reactive({
	size: 'md' as ButtonSize,
	type: 'button' as ButtonType,
	disabled: false,
	value: 'button'
});
</script>
