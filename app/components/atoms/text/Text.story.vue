<template>
	<Story title="Atoms/Text">
		<template #controls>
			<HstText v-model="state.value" title="value" />
			<HstSelect v-model="state.size" title="size" :options="textSizeOptions" />
			<HstSelect v-model="state.weight" title="weight" :options="textWeightOptions" />
			<HstSelect v-model="state.type" title="type" :options="textTypeOptions" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<Text :type="state.type" :size="state.size" :weight="state.weight">
					{{ state.value }}
				</Text>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { TextSize, TextType, TextWeight } from './Text.types';
import { textSizeOptions, textTypeOptions, textWeightOptions } from './Text.constants';

const state = reactive({
	value: 'sample text',
	size: 'md' as TextSize,
	type: 'p' as TextType,
	weight: 'regular' as TextWeight
});
</script>
