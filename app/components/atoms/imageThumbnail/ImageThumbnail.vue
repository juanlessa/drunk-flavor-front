<template>
	<div class="overflow-hidden bg-surface-sunken">
		<img
			v-if="isPrimaryReady"
			class="h-full w-full rounded-[inherit] object-cover"
			:src="props.src"
			:alt="props.alt" />

		<!-- Content given by the parent replaces the fallback images, e.g. an icon drawn with the theme colors. -->
		<slot v-else-if="isPrimaryDone && $slots.fallback" name="fallback" />
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
import { computed, watch } from 'vue';
import { useImage } from '@vueuse/core';

const props = defineProps({
	src: { type: String, required: true },
	/** Image shown when `src` fails. Not needed when the `fallback` slot is given. */
	srcFallback: { type: String, default: '' },
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
const isPrimaryReady = computed(
	() => !!props.src && (primary.isReady.value || loadedSources.has(props.src))
);
watch(
	() => primary.isReady.value,
	(ready) => {
		if (ready && props.src) loadedSources.add(props.src);
	},
	{ immediate: true }
);

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
<script lang="ts">
/**
 * Sources that already loaded in this session. `useImage` starts every instance as not ready, even for a
 * cached image, so a thumbnail that is mounted again (a virtualized list unmounts the rows that leave the
 * screen) would show an empty box for a few frames before its image appears. A known source skips that wait.
 */
const loadedSources = new Set<string>();
</script>
