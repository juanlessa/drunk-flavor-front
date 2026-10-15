<template>
	<Story title="Atoms/TextList">
		<Variant title="Unordered">
			<template #controls>
				<HstSelect
					v-model="unorderedState.marker"
					title="marker"
					:options="textListUnorderedMarkerOptions" />
				<HstSelect v-model="unorderedState.gap" title="gap" :options="textListGapOptions" />
			</template>

			<div class="p-4">
				<TextList
					as="ul"
					:marker="unorderedState.marker"
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
				<HstSelect v-model="orderedState.gap" title="gap" :options="textListGapOptions" />
				<HstCheckbox v-model="orderedState.reversed" title="reversed" />
			</template>

			<div class="p-4">
				<TextList
					as="ol"
					:marker="orderedState.marker"
					:gap="orderedState.gap"
					:reversed="orderedState.reversed"
					:items="items" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { TextListUnorderedMarker, TextListOrderedMarker, TextListGap } from './TextList.types';
import {
	textListUnorderedMarkerOptions,
	textListOrderedMarkerOptions,
	textListGapOptions
} from './TextList.constants';

const items = ['First item', 'Second item', 'Third item', 'Fourth item'];

const unorderedState = reactive({
	marker: 'disc' as TextListUnorderedMarker,
	gap: 'sm' as TextListGap
});

const orderedState = reactive({
	marker: 'decimal' as TextListOrderedMarker,
	gap: 'sm' as TextListGap,
	reversed: false
});
</script>
