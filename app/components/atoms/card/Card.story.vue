<template>
	<Story title="Atoms/Card">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.content" title="content" />
			<HstSelect v-model="state.rounded" title="rounded" :options="cardRoundedOptions" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Card :rounded="state.rounded" class="px-4 py-2">
					<Text>
						{{ state.content }}
					</Text>
				</Card>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import type { CardRounded } from './Card.types';
import { cardRoundedOptions } from './Card.constants';

type State = {
	content: string;
	rounded: CardRounded;
};
function initState(): State {
	return {
		content: 'card sample content',
		rounded: 'md'
	};
}
</script>
