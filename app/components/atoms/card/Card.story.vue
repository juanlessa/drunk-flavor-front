<template>
	<Story title="Atoms/Card">
		<template #controls>
			<HstText v-model="state.content" title="content" />
			<HstSelect v-model="state.rounded" title="rounded" :options="cardRoundedOptions" />
		</template>

		<Variant title="default">
			<Card :rounded="state.rounded" class="px-4 py-2">
				<Text>
					{{ state.content }}
				</Text>
			</Card>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { CardRounded } from './Card.types';
import { cardRoundedOptions } from './Card.constants';

const state = reactive({
	content: 'card sample content',
	rounded: 'md' as CardRounded
});
</script>
