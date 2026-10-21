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
					class="h-full aspect-square shrink-0 rounded-control"
					:src="drink.thumbnail?.url ?? ''"
					alt="drink thumbnail"
					src-fallback="/thumbnail-placeholder.png" />
				<div class="flex-1 min-w-0 flex flex-col gap-8 overflow-hidden">
					<Heading class="text-center">
						{{ drink.translations[$i18n.locale].name }}
					</Heading>
					<div
						class="flex-1 flex flex-wrap content-start justify-center gap-x-4 gap-y-1 overflow-hidden">
						<Text
							v-for="ingredientName in ingredientNames"
							:key="ingredientName"
							as="span"
							class="text-content-muted whitespace-nowrap leading-shorter">
							{{ ingredientName }}
						</Text>
					</div>
				</div>
			</Card>
		</template>

		<DrinkDetail :drink="drink" class="w-120" />
	</HoverCard>
</template>
<script setup lang="ts">
import type { Drink } from '~/domain/drink/drink.entity';
import { initEmptyDrink } from '~/domain/drink/drink.factory';

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});

const emit = defineEmits<{
	(e: 'click'): void;
}>();

const { locale } = useI18n();

// Localized ingredient names shown under the drink name. The template clips any
// that do not fit the remaining card height (overflow-hidden on the container).
const ingredientNames = computed(() =>
	props.drink.ingredients.map((item) => item.ingredient.translations[locale.value].name)
);
</script>
