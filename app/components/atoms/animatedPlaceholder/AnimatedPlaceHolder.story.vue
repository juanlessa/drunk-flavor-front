<template>
	<Story title="Atoms/AnimatedPlaceHolder">
		<template #controls>
			<HstText v-model="state.height" title="height" />
			<HstText v-model="state.width" title="width" />
			<HstText v-model="state.borderRadius" title="borderRadius" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<AnimatedPlaceHolder
					:height="state.height"
					:width="state.width"
					:border-radius="state.borderRadius" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	height: '1.5rem',
	width: '5rem',
	borderRadius: '0px'
});
</script>
