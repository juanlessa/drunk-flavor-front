<template>
	<div class="overflow-hidden bg-surface-sunken">
		<img
			v-if="isPrimaryReady"
			class="h-full w-full rounded-[inherit] object-cover"
			:src="props.src"
			:alt="props.alt" />

		<img
			v-else-if="isFallbackReady"
			class="h-full w-full rounded-[inherit] object-cover"
			:src="props.srcFallback"
			:alt="props.alt" />

		<AnimatedPlaceHolder v-else-if="isLoading" class="h-full w-full rounded-[inherit]" />
	</div>
</template>

<script setup lang="ts">
/**
 * Thumbnail com cadeia de fallback:
 * 1. Enquanto `src` carrega, exibe o AnimatedPlaceHolder.
 * 2. Se `src` resolve, exibe a imagem principal.
 * 3. Se `src` falha (ou vem vazio), tenta `srcFallback`.
 * 4. Se ambas falham, nenhuma imagem e renderizada e o fundo cinza do
 *    container (`bg-surface-sunken`) permanece visivel.
 *
 * As tres props sao obrigatorias de proposito: um thumbnail sem src, fallback
 * ou alt e um erro de uso, entao o componente nao oferece defaults.
 */
import { computed } from 'vue';
import { useImage } from '@vueuse/core';

const props = defineProps({
	src: { type: String, required: true },
	srcFallback: { type: String, required: true },
	alt: { type: String, required: true }
});

const primary = useImage(() => ({ src: props.src }));
const fallback = useImage(() => ({ src: props.srcFallback }));

/** Primary resolved to a usable image. An empty src can never be ready. */
const isPrimaryReady = computed(() => !!props.src && primary.isReady.value);

/** Primary is done and did not produce an image, so the fallback takes over. */
const isPrimaryDone = computed(() => !props.src || (!primary.isLoading.value && !isPrimaryReady.value));

/** Show the fallback only after the primary failed and the fallback resolved. */
const isFallbackReady = computed(() => isPrimaryDone.value && fallback.isReady.value);

/** Keep the placeholder up while a source that can still succeed is loading. */
const isLoading = computed(() => {
	if (!!props.src && primary.isLoading.value) return true;
	if (isPrimaryDone.value && !fallback.isReady.value && fallback.isLoading.value) return true;
	return false;
});
</script>
