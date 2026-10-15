<template>
	<Story title="Atoms/Card">
		<template #controls>
			<HstText v-model="state.content" title="content" />
		</template>

		<Variant title="default">
			<Card class="px-4 py-2">
				<Text>
					{{ state.content }}
				</Text>
			</Card>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	content: 'card sample content'
});
</script>
