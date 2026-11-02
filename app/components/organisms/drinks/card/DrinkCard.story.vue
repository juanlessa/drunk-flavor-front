<template>
	<Story title="Organisms/DrinkCard">
		<template #controls="{ state }">
			<HstText v-model="(state as State).drink.translations.en.name" title="name" />
			<HstText v-model="(state as State).drink.translations.en.method" title="method" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<DrinkCard :drink="(state as State).drink" />
			</template>
		</Variant>

		<Variant title="with skeleton" :init-state="initState">
			<template #default="{ state }">
				<!-- Same 152px row height as the overview grid, to compare the card and its skeleton. -->
				<div class="p-4 flex flex-col gap-4">
					<div class="h-38 flex justify-center">
						<DrinkCard :drink="(state as State).drink" />
					</div>
					<div class="h-38 flex justify-center">
						<DrinkCardSkeleton />
					</div>
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink } from '~/domain/drink/drink.entity';

type State = {
	drink: Drink;
};

function initState(): State {
	const drink = initEmptyDrink();
	drink.translations.en = { name: 'Drink title', method: 'Shake and serve' };
	drink.translations.pt = { name: 'Nome do drink', method: 'Bata e sirva' };
	return { drink };
}
</script>
