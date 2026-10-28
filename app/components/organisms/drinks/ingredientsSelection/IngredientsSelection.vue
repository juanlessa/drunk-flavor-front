<template>
	<Box direction="col" class="gap-4 flex-1">
		<Label class="text-center">
			{{ $t('drinkForm.ingredients.label') }}
		</Label>
		<Search
			id="search-ingredients"
			v-model:search-term="searchTerm"
			:options="mapToSelectOptions(options, $i18n.locale)"
			infinite-scroll
			:loading="loading"
			@load-more="loadNextPage"
			@select="handleSelect" />

		<Box direction="col" class="gap-2">
			<Box v-for="(sel, index) in selected" :key="sel.id" direction="col" class="gap-1">
				<Box direction="row" class="gap-6 items-center">
					<Text class="flex-1 text-left">{{ sel.translations[$i18n.locale].name }}</Text>

					<InputNumber
						:id="`ingredient-quantity-${sel.id}`"
						:model-value="quantities[sel.id]"
						input-width="4ch"
						suffix-width="7ch"
						suffix-outside
						:suffix="sel.unit.symbol || sel.unit.translations[$i18n.locale].name"
						:has-error="!!props.checkError(`ingredients.${index}.quantity`)"
						@update:model-value="(val: number) => updateQuantity(sel.id, val)"
						@blur="emit('blur')" />

					<Button
						variant="icon"
						:aria-label="$t('organisms.ingredientsSelection.removeButton.label')"
						@click="handleRemove(sel.id)">
						<TrashIcon />
					</Button>
				</Box>
				<ErrorMessage
					v-if="props.checkError(`ingredients.${index}.quantity`)"
					class="text-right"
					:value="props.checkError(`ingredients.${index}.quantity`)" />
			</Box>
		</Box>
		<ErrorMessage
			v-if="props.checkError('ingredients')"
			:value="props.checkError('ingredients')" />
	</Box>
</template>
<script setup lang="ts">
import { mapToSelectOptions } from '~/components/atoms/inputSelect/InputSelect.helpers';
import type { DrinkIngredient } from '~/domain/drink/drink.entity';
import type { DrinkIngredientRequest } from '~/domain/drink/drink.dtos';

const props = defineProps({
	initialIngredients: {
		type: Array as PropType<DrinkIngredient[]>,
		default: () => []
	},
	checkError: {
		type: Function as PropType<(field: string) => string>,
		default: () => ''
	}
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: DrinkIngredientRequest[]): void;
	(e: 'blur'): void;
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
		quantities.value[di.ingredient.id] = di.quantity;
	});
}

const updateQuantity = (ingredientId: string, value: number) => {
	quantities.value[ingredientId] = value;
	emitIngredients();
};

const handleRemove = (ingredientId: string) => {
	handleRemoveSelected({ label: '', value: ingredientId });
	const { [ingredientId]: _, ...rest } = quantities.value;
	quantities.value = rest;
	emitIngredients();
};

const emitIngredients = () => {
	const ingredients: DrinkIngredientRequest[] = selected.value.map((sel) => ({
		ingredientId: sel.id,
		quantity: quantities.value[sel.id] || 0
	}));
	emit('update:modelValue', ingredients);
};

watch(
	selected,
	() => {
		selected.value.forEach((sel) => {
			if (!(sel.id in quantities.value)) {
				quantities.value[sel.id] = 0;
			}
		});
		emitIngredients();
	},
	{ deep: true }
);
</script>
