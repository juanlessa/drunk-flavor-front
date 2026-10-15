<template>
	<Story title="Atoms/Image">
		<template #controls>
			<HstText v-model="state.src" title="src" />
			<HstText v-model="state.alt" title="alt" />
			<HstText v-model="state.height" title="height" />
		</template>

		<Variant title="default">
			<div class="m-3" :style="{ height: state.height }">
				<Image :src="state.src" :alt="state.alt" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	src: '/logo.png',
	alt: 'Drunk Flavor',
	height: '3rem'
});
</script>
