<template>
	<Story title="Atoms/Text">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.value" title="value" />
			<HstSelect v-model="state.size" title="size" :options="textSizeOptions" />
			<HstSelect v-model="state.weight" title="weight" :options="textWeightOptions" />
			<HstSelect v-model="state.type" title="type" :options="textTypeOptions" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Text :type="state.type" :size="state.size" :weight="state.weight">
					{{ state.value }}
				</Text>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import type { TextSize, TextType, TextWeight } from '~/types/Text';
import { textSizeOptions, textTypeOptions, textWeightOptions } from '~/constants/Text';

type State = {
	value: string;
	size: TextSize;
	type: TextType;
	weight: TextWeight;
};

function initState(): State {
	return {
		value: 'sample text',
		size: 'md',
		type: 'p',
		weight: 'regular'
	};
}
</script>
