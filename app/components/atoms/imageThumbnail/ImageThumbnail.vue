<template>
	<div class="overflow-hidden bg-surface-sunken">
		<img
			v-if="isPrimaryReady"
			class="h-full w-full rounded-[inherit] object-cover"
			:src="props.src"
			:alt="props.alt" />

		<template v-else-if="isFallbackReady">
			<img
				:class="[
					'h-full w-full rounded-[inherit] object-cover',
					isDarkFallbackReady && 'dark:hidden'
				]"
				:src="props.srcFallback"
				:alt="props.alt" />
			<img
				v-if="isDarkFallbackReady"
				class="h-full w-full rounded-[inherit] object-cover hidden dark:block"
				:src="props.srcFallbackDark"
				:alt="props.alt" />
		</template>

		<AnimatedPlaceHolder v-else-if="isLoading" class="h-full w-full rounded-[inherit]" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useImage } from '@vueuse/core';

const props = defineProps({
	src: { type: String, required: true },
	srcFallback: { type: String, required: true },
	srcFallbackDark: { type: String, default: undefined },
	alt: { type: String, required: true }
});

/**
 * A source that fails to load is an expected state here: the template falls back to the next image.
 * `useImage` reports failures through `globalThis.reportError` by default, which surfaces every missing
 * thumbnail (an empty src always fails) as an uncaught error, so failures are handled locally instead.
 */
const IMAGE_OPTIONS = { onError: () => {} };

const primary = useImage(() => ({ src: props.src }), IMAGE_OPTIONS);
const fallback = useImage(() => ({ src: props.srcFallback }), IMAGE_OPTIONS);
const darkFallback = useImage(() => ({ src: props.srcFallbackDark ?? '' }), IMAGE_OPTIONS);

/** Primary resolved to a usable image. An empty src can never be ready. */
const isPrimaryReady = computed(() => !!props.src && primary.isReady.value);

/** Primary is done and did not produce an image, so the fallback takes over. */
const isPrimaryDone = computed(
	() => !props.src || (!primary.isLoading.value && !isPrimaryReady.value)
);

/** Show the light fallback after the primary failed and the fallback resolved. */
const isFallbackReady = computed(() => isPrimaryDone.value && fallback.isReady.value);

/** Switch assets only after the optional dark fallback is ready. */
const isDarkFallbackReady = computed(
	() => isFallbackReady.value && !!props.srcFallbackDark && darkFallback.isReady.value
);

/** Keep the loading placeholder visible while a required source can still succeed. */
const isLoading = computed(() => {
	if (!!props.src && primary.isLoading.value) return true;
	if (isPrimaryDone.value && !fallback.isReady.value && fallback.isLoading.value) return true;
	return false;
});
</script>
