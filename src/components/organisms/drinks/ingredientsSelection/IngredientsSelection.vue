<template>
	<Box direction="col" class="gap-4 flex-1">
		<Label class="text-center">
			{{ $t('drinkForm.ingredients.label') }}
		</Label>
		<Search
			id="search-ingredients"
			v-model:search-term="searchTerm"
			:options="mapToSelectOptions(options, $i18n.locale as Language)"
			infinite-scroll
			:loading="loading"
			@load-more="loadNextPage"
			@select="handleSelect" />

		<Box direction="col" class="gap-2">
			<Box v-for="sel in selected" :key="sel._id" direction="row" class="gap-6 items-center">
				<Text class="flex-1 text-left">{{
					sel.translations[$i18n.locale as Language].name
				}}</Text>

				<InputNumber
					:model-value="quantities[sel._id]"
					input-width="4ch"
					suffix-outside
					:suffix="sel.translations[$i18n.locale as Language].unit"
					@update:model-value="(val: number) => updateQuantity(sel._id, val)" />

				<button aria-label="remove ingredient" @click="handleRemove(sel._id)">
					<TrashIcon />
				</button>
			</Box>
		</Box>
	</Box>
</template>
<script setup lang="ts">
import type { DrinkIngredient, DrinkIngredientRequest } from '~/types/drink';
import type { Language } from '~/types/translations';
import { mapToSelectOptions } from '~/helpers/inputSelect.helpers';

const props = defineProps({
	initialIngredients: {
		type: Array as PropType<DrinkIngredient[]>,
		default: () => []
	}
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: DrinkIngredientRequest[]): void;
}>();

const {
	options,
	searchTerm,
	loading,
	selected,
	handleSelect,
	handleRemoveSelected,
	initSelected,
	loadNextPage
} = useIngredientSearch();

const quantities = ref<Record<string, number>>({});

if (props.initialIngredients.length > 0) {
	initSelected(props.initialIngredients.map((di) => di.ingredient));
	props.initialIngredients.forEach((di) => {
		quantities.value[di.ingredient._id] = di.quantity;
	});
}

const updateQuantity = (ingredientId: string, value: number) => {
	quantities.value[ingredientId] = value;
	emitIngredients();
};

const handleRemove = (ingredientId: string) => {
	handleRemoveSelected({ label: '', value: ingredientId });
	delete quantities.value[ingredientId];
	emitIngredients();
};

const emitIngredients = () => {
	const ingredients: DrinkIngredientRequest[] = selected.value.map((sel) => ({
		ingredient_id: sel._id,
		quantity: quantities.value[sel._id] || 0
	}));
	emit('update:modelValue', ingredients);
};

watch(
	selected,
	() => {
		selected.value.forEach((sel) => {
			if (!(sel._id in quantities.value)) {
				quantities.value[sel._id] = 0;
			}
		});
		emitIngredients();
	},
	{ deep: true }
);
</script>
