<template>
	<Story title="Atoms/Badge">
		<template #controls>
			<HstText v-model="state.value" title="value" />
		</template>
		<Variant v-for="tone in tones" :key="tone" :title="tone">
			<Badge :tone="tone" :value="state.value" />
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import type { BadgeTone } from './Badge.types';

const tones: BadgeTone[] = ['accent', 'success', 'warning', 'neutral'];
const state = reactive({ value: 'Active' });
</script>
