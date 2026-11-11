<template>
	<Story title="Atoms/ImageThumbnail">
		<template #controls>
			<HstText v-model="state.src" title="src" />
			<HstText v-model="state.srcFallback" title="srcFallback" />
			<HstText v-model="state.alt" title="alt" />
		</template>

		<Variant title="Primary loads">
			<div class="m-3 size-32">
				<ImageThumbnail
					:src="state.src"
					:src-fallback="state.srcFallback"
					:alt="state.alt" />
			</div>
		</Variant>

		<Variant title="Primary fails, fallback loads">
			<div class="m-3 size-32">
				<ImageThumbnail
					src="/invalid-source.png"
					:src-fallback="state.srcFallback"
					:alt="state.alt" />
			</div>
		</Variant>

		<Variant title="Both fail (grey surface)">
			<div class="m-3 size-32">
				<ImageThumbnail
					src="/invalid-source.png"
					src-fallback="/also-invalid.png"
					:alt="state.alt" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	src: '/images/logo-mark.svg',
	srcFallback: '/images/logo-mark.svg',
	alt: 'thumbnail'
});
</script>
