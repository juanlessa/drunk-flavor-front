<template>
	<div
		class="animate-loading bg-loading-gradient dark:bg-loading-dark-gradient bg-[length:200%_100%]"
		:style="{ height, width, borderRadius }">
		&nbsp;
	</div>
</template>
<script setup>
defineProps({
	height: { type: String, default: '1.5rem' },
	width: { type: String, default: '3rem' },
	borderRadius: { type: String, default: '0px' }
});
</script>
