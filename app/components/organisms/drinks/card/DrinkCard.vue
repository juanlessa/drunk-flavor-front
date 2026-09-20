<template>
	<HoverCard side="right" :side-offset="-8" :align="'start'" :align-offset="8">
		<template #trigger>
			<Card
				class="w-full h-full p-2 flex gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2"
				tabindex="0"
				role="button"
				@click="emit('click')"
				@keydown.enter="emit('click')"
				@keydown.space.prevent="emit('click')">
				<ImageThumbnail
					:src="drink.thumbnail?.url ?? ''"
					alt="drink thumbnail"
					src-fallback="/thumbnail-placeholder.png" />
				<div>
					<Heading>{{ drink.translations[$i18n.locale].name }}</Heading>
				</div>
			</Card>
		</template>

		<DrinkDetail :drink="drink" class="w-120" />
	</HoverCard>
</template>
<script setup lang="ts">
import type { Drink } from '~/domain/drink/drink.entity';
import { initEmptyDrink } from '~/domain/drink/drink.factory';

defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});

const emit = defineEmits<{
	(e: 'click'): void;
}>();
</script>
