<template>
	<Story title="Atoms/Anchor">
		<template #controls>
			<HstText v-model="state.value" title="value" />
			<HstText v-model="state.to" title="to" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<Anchor :to="state.to">
					{{ state.value }}
				</Anchor>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	value: 'Click here',
	to: '/'
});
</script>
