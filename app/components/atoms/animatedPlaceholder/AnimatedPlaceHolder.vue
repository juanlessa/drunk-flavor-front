<template>
	<div :class="animatedPlaceholderStyle({ class: attrs.class })">&nbsp;</div>
</template>
<script setup>
import { useAttrs } from 'vue';
import { tv } from '~/utils/tv';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const animatedPlaceholderStyle = tv({
	base: 'animate-loading bg-loading-gradient h-6 w-12 rounded-none'
});
</script>
