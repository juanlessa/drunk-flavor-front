<template>
	<Story title="Atoms/Image">
		<template #controls>
			<HstText v-model="state.alt" title="alt" />
			<HstText v-model="state.width" title="width" />
			<HstText v-model="state.height" title="height" />
			<HstSelect v-model="state.rounded" title="rounded" :options="imageRoundedOptions" />
			<HstCheckbox v-model="state.strict" title="strict" />
		</template>

		<Variant title="With Image">
			<div class="m-3">
				<Image
					:src="logoSrc"
					:alt="state.alt"
					:width="state.width"
					:height="state.height"
					:rounded="state.rounded"
					:strict="state.strict" />
			</div>
		</Variant>

		<Variant title="Fallback">
			<div class="m-3">
				<Image
					src="/invalid-source.png"
					:alt="state.alt"
					:width="state.width"
					:height="state.height"
					:rounded="state.rounded"
					:strict="state.strict" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { ImageRounded } from './Image.types';
import { imageRoundedOptions } from './Image.constants';
import logoSrc from '~/assets/logo.png';

const state = reactive({
	alt: 'image alt',
	width: '21rem',
	height: '4rem',
	rounded: 'md' as ImageRounded,
	strict: false
});
</script>
