<template>
	<component :is="props.as" class="text-body font-regular text-content">
		<slot>{{ props.value }}</slot>
	</component>
</template>
<script setup lang="ts">
const props = defineProps({
	as: {
		type: String as PropType<TextType>,
		default: 'p'
	},
	value: {
		type: String,
		default: ''
	}
});
</script>
