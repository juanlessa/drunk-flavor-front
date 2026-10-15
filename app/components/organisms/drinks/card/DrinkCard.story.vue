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
