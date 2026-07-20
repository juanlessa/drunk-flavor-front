<template>
	<Story title="Atoms/Anchor">
		<template #controls>
			<HstText v-model="state.value" title="value" />
			<HstText v-model="state.to" title="to" />
			<HstSelect v-model="state.size" title="size" :options="anchorSizeOptions" />
			<HstSelect v-model="state.weight" title="weight" :options="anchorWeightOptions" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<Anchor :to="state.to" :size="state.size" :weight="state.weight">
					{{ state.value }}
				</Anchor>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { AnchorSize, AnchorWeight } from './Anchor.types';
import { anchorSizeOptions, anchorWeightOptions } from './Anchor.constants';

const state = reactive({
	value: 'Click here',
	to: '/',
	size: 'md' as AnchorSize,
	weight: 'regular' as AnchorWeight
});
</script>
