<template>
	<Story title="Atoms/ImageCover">
		<template #controls>
			<HstText v-model="state.src" title="src" />
			<HstText v-model="state.alt" title="alt" />
		</template>

		<Variant title="Informative (role=img + aria-label)">
			<div class="m-3">
				<ImageCover :src="state.src" :alt="state.alt" />
			</div>
		</Variant>

		<Variant title="Decorative (aria-hidden)">
			<div class="m-3">
				<ImageCover :src="state.src" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	src: '/sob-bg.png',
	alt: 'Sex on the Beach'
});
</script>
