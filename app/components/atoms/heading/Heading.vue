<template>
	<component :is="props.as" class="text-title font-bold text-content">
		<slot>{{ props.value }}</slot>
	</component>
</template>
<script setup lang="ts">
import type { HeadingType } from './Heading.types';

const props = defineProps({
	as: {
		type: String as PropType<HeadingType>,
		default: 'h2'
	},
	value: {
		type: String,
		default: ''
	}
});
</script>
