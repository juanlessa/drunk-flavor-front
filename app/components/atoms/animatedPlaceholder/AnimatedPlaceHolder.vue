<template>
	<div class="animate-loading bg-loading-gradient" :style="{ height, width, borderRadius }">
		&nbsp;
	</div>
</template>
<script setup>
defineProps({
	height: { type: String, default: '1.5rem' },
	width: { type: String, default: '3rem' },
	borderRadius: { type: String, default: 'var(--radius-none)' }
});
</script>
