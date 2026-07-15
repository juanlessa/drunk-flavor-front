<template>
	<Story title="Atoms/Heading">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.value" title="value" />
			<HstSelect v-model="state.size" title="size" :options="headingSizeOptions" />
			<HstSelect v-model="state.type" title="type" :options="headingTypeOptions" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Heading :type="state.type" :size="state.size">
					{{ state.value }}
				</Heading>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import type { HeadingSize, HeadingType } from '~/types/Heading';
import { headingSizeOptions, headingTypeOptions } from '~/constants/Heading';

type State = {
	value: string;
	size: HeadingSize;
	type: HeadingType;
};

function initState(): State {
	return {
		value: 'sample Heading',
		size: 'md',
		type: 'h2'
	};
}
</script>
