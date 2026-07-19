<template>
	<Story title="Atoms/Anchor">
		<template #controls="{ state }">
			<HstText v-model="(state as State).value" title="value" />
			<HstText v-model="(state as State).to" title="to" />
			<HstSelect v-model="(state as State).size" title="size" :options="anchorSizeOptions" />
			<HstSelect v-model="(state as State).weight" title="weight" :options="anchorWeightOptions" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4">
					<Anchor
						:to="(state as State).to"
						:size="(state as State).size"
						:weight="(state as State).weight">
						{{ (state as State).value }}
					</Anchor>
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import type { AnchorSize, AnchorWeight } from './Anchor.types';
import { AnchorSizeEnum, AnchorWeightEnum } from './Anchor.types';

const anchorSizeOptions = Object.keys(AnchorSizeEnum) as AnchorSize[];
const anchorWeightOptions = Object.keys(AnchorWeightEnum) as AnchorWeight[];

type State = {
	value: string;
	to: string;
	size: AnchorSize;
	weight: AnchorWeight;
};

function initState(): State {
	return {
		value: 'Click here',
		to: '/',
		size: 'md',
		weight: 'regular'
	};
}
</script>
