<template>
	<Story title="Atoms/TextList">
		<template #controls="{ state }">
			<HstSelect
				v-model="(state as State).type"
				title="type"
				:options="textListTypeOptions" />
			<HstSelect
				v-model="(state as State).marker"
				title="marker"
				:options="textListMarkerOptions" />
			<HstSelect
				v-model="(state as State).size"
				title="size"
				:options="textListSizeOptions" />
			<HstSelect
				v-model="(state as State).weight"
				title="weight"
				:options="textListWeightOptions" />
			<HstSelect v-model="(state as State).gap" title="gap" :options="textListGapOptions" />
			<HstCheckbox v-model="(state as State).reversed" title="reversed" />
		</template>

		<Variant title="unordered" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4">
					<TextList
						:type="(state as State).type"
						:marker="(state as State).marker"
						:size="(state as State).size"
						:weight="(state as State).weight"
						:gap="(state as State).gap"
						:reversed="(state as State).reversed"
						:items="sampleItems" />
				</div>
			</template>
		</Variant>

		<Variant title="ordered" :init-state="initOrderedState">
			<template #default="{ state }">
				<div class="p-4">
					<TextList
						:type="(state as State).type"
						:marker="(state as State).marker"
						:size="(state as State).size"
						:weight="(state as State).weight"
						:gap="(state as State).gap"
						:reversed="(state as State).reversed"
						:items="stepsItems" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import type {
	TextListType,
	TextListMarker,
	TextListSize,
	TextListWeight,
	TextListGap
} from './TextList.types';
import {
	textListTypeOptions,
	textListMarkerOptions,
	textListSizeOptions,
	textListWeightOptions,
	textListGapOptions
} from './TextList.constants';

type State = {
	type: TextListType;
	marker: TextListMarker;
	size: TextListSize;
	weight: TextListWeight;
	gap: TextListGap;
	reversed: boolean;
};

const sampleItems = ['Rum', 'Coconut Cream', 'Pineapple Juice', 'Ice cubes'];

const stepsItems = [
	'Blend the rum, coconut cream, and pineapple juice with ice',
	'Pour into a chilled glass',
	'Garnish with a pineapple slice and cherry'
];

function initState(): State {
	return {
		type: 'ul',
		marker: 'disc',
		size: 'md',
		weight: 'regular',
		gap: 'sm',
		reversed: false
	};
}

function initOrderedState(): State {
	return {
		type: 'ol',
		marker: 'decimal',
		size: 'md',
		weight: 'regular',
		gap: 'sm',
		reversed: false
	};
}
</script>
