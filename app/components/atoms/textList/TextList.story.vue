<template>
	<Story title="Atoms/TextList">
		<Variant title="Unordered">
			<template #controls>
				<HstSelect
					v-model="unorderedState.marker"
					title="marker"
					:options="textListUnorderedMarkerOptions" />
				<HstSelect
					v-model="unorderedState.size"
					title="size"
					:options="textListSizeOptions" />
				<HstSelect
					v-model="unorderedState.weight"
					title="weight"
					:options="textListWeightOptions" />
				<HstSelect v-model="unorderedState.gap" title="gap" :options="textListGapOptions" />
			</template>

			<div class="p-4">
				<TextList
					type="ul"
					:marker="unorderedState.marker"
					:size="unorderedState.size"
					:weight="unorderedState.weight"
					:gap="unorderedState.gap"
					:items="items" />
			</div>
		</Variant>

		<Variant title="Ordered">
			<template #controls>
				<HstSelect
					v-model="orderedState.marker"
					title="marker"
					:options="textListOrderedMarkerOptions" />
				<HstSelect
					v-model="orderedState.size"
					title="size"
					:options="textListSizeOptions" />
				<HstSelect
					v-model="orderedState.weight"
					title="weight"
					:options="textListWeightOptions" />
				<HstSelect v-model="orderedState.gap" title="gap" :options="textListGapOptions" />
				<HstCheckbox v-model="orderedState.reversed" title="reversed" />
			</template>

			<div class="p-4">
				<TextList
					type="ol"
					:marker="orderedState.marker"
					:size="orderedState.size"
					:weight="orderedState.weight"
					:gap="orderedState.gap"
					:reversed="orderedState.reversed"
					:items="items" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type {
	TextListUnorderedMarker,
	TextListOrderedMarker,
	TextListSize,
	TextListWeight,
	TextListGap
} from './TextList.types';
import {
	textListUnorderedMarkerOptions,
	textListOrderedMarkerOptions,
	textListSizeOptions,
	textListWeightOptions,
	textListGapOptions
} from './TextList.constants';

const items = ['First item', 'Second item', 'Third item', 'Fourth item'];

const unorderedState = reactive({
	marker: 'disc' as TextListUnorderedMarker,
	size: 'md' as TextListSize,
	weight: 'regular' as TextListWeight,
	gap: 'sm' as TextListGap
});

const orderedState = reactive({
	marker: 'decimal' as TextListOrderedMarker,
	size: 'md' as TextListSize,
	weight: 'regular' as TextListWeight,
	gap: 'sm' as TextListGap,
	reversed: false
});
</script>
