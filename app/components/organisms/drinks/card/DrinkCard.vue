<template>
	<HoverCard side="right" :side-offset="-8" :align="'start'" :align-offset="8">
		<template #trigger>
			<Card
				rounded="md"
				class="w-full h-full p-2 flex gap-4 cursor-pointer"
				@click="emit('click')">
				<Image :src="drink.thumbnail?.url ?? ''" alt="drink thumbnail" />
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
