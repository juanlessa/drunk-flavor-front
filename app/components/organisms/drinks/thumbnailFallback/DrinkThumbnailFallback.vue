<template>
	<!--
		What a drink shows in place of its thumbnail when it has none, or when it fails to load: a line drawing
		of a glass, about the size of a glass in a photo, in the theme colors. Fills its ImageThumbnail.
	-->
	<div
		class="flex size-full items-center justify-center rounded-[inherit] bg-accent-subtle text-accent-content"
		data-testid="drink-thumbnail-fallback">
		<HurricaneGlassIcon class="size-[64%]" aria-hidden="true" />
	</div>
</template>
<script setup lang="ts">
import HurricaneGlassIcon from '~/components/icons/HurricaneGlassIcon.vue';
</script>
