<template>
	<Story title="Atoms/Heading">
		<template #controls>
			<HstText v-model="state.value" title="value" />
			<HstSelect v-model="state.size" title="size" :options="headingSizeOptions" />
			<HstSelect v-model="state.type" title="type" :options="headingTypeOptions" />
		</template>

		<Variant title="default">
			<Heading :type="state.type" :size="state.size">
				{{ state.value }}
			</Heading>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { HeadingSize, HeadingType } from './Heading.types';
import { headingSizeOptions, headingTypeOptions } from './Heading.constants';

const state = reactive({
	value: 'sample Heading',
	size: 'md' as HeadingSize,
	type: 'h2' as HeadingType
});
</script>
