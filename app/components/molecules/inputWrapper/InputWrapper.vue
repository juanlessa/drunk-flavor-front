<template>
	<Box direction="col" class="w-full gap-1">
		<Box
			:direction="props.direction"
			class="gap-2"
			:class="props.direction === 'row' && 'items-center'">
			<slot name="label"></slot>
			<slot></slot>
		</Box>
		<slot name="error"></slot>
	</Box>
</template>

<script setup lang="ts">
import type { InputWrapperDirection } from './InputWrapper.types';

const props = defineProps({
	direction: { type: String as PropType<InputWrapperDirection>, default: 'col' }
});
</script>
