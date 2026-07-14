<template>
	<HoverCard side="right" :side-offset="8">
		<template #trigger>
			<Card rounded="md" class="p-2 flex gap-4">
				<Thumbnail />
				<div>
					<Heading>{{ drink.translations[$i18n.locale as Language].name }}</Heading>
				</div>
			</Card>
		</template>
		<Card rounded="md" class="p-4">
			<Heading>{{ drink.translations[$i18n.locale as Language].name }}</Heading>
			<div class="flex flex-col gap-1 mt-2">
				<Text v-for="(item, index) in drink.ingredients" :key="index">
					{{ item.quantity }}
					{{ item.ingredient.translations[$i18n.locale as Language].unit }} —
					{{ item.ingredient.translations[$i18n.locale as Language].name }}
				</Text>
			</div>
		</Card>
	</HoverCard>
</template>
<script setup lang="ts">
import { initEmptyDrink } from '~/constants/drink';
import type { Drink } from '~/types/drink';
import type { Language } from '~/types/translations';

defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});
</script>
