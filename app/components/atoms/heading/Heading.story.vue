<template>
	<Story title="Atoms/Heading">
		<template #controls>
			<HstText v-model="state.value" title="value" />
			<HstSelect v-model="state.as" title="as" :options="headingTypeOptions" />
		</template>

		<Variant title="default">
			<Heading :as="state.as">
				{{ state.value }}
			</Heading>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { HeadingType } from './Heading.types';
import { headingTypeOptions } from './Heading.constants';

const state = reactive({
	value: 'sample Heading',
	as: 'h2' as HeadingType
});
</script>
