<template>
	<div class="flex flex-col gap-5">
		<div class="flex flex-col gap-2">
			<Label for="search-ingredients">
				{{ $t('organisms.ingredientsSelection.searchInput.label') }}
			</Label>
			<Search
				id="search-ingredients"
				v-model:search-term="searchTerm"
				:options="searchOptions"
				:placeholder="$t('organisms.ingredientsSelection.searchInput.placeholder')"
				:no-result="$t('organisms.ingredientsSelection.searchInput.noResult')"
				infinite-scroll
				:loading="loading"
				@load-more="loadNextPage"
				@select="handleAdd">
				<template #prefix>
					<SearchIcon
						class="shrink-0 fill-current text-content-muted"
						aria-hidden="true" />
				</template>
			</Search>
		</div>

		<p :id="instructionsId" class="sr-only">
			{{ $t('organisms.ingredientsSelection.reorderInstructions') }}
		</p>

		<!-- Sortable drives the drag; `moveArrayElement` undoes its DOM move so Vue keeps owning the list. -->
		<ol v-if="selected.length" ref="sortableList" class="flex flex-col gap-2">
			<IngredientsSelectionItem
				v-for="(ingredient, index) in selected"
				:key="ingredient.id"
				:ingredient="ingredient"
				:index="index"
				:total="selected.length"
				:quantity="quantities[ingredient.id] ?? 0"
				:error="props.checkError(`ingredients.${index}.amount.quantity`)"
				:instructions-id="instructionsId"
				@update:quantity="(value) => updateQuantity(ingredient.id, value)"
				@move-up="move(index, index - 1)"
				@move-down="move(index, index + 1)"
				@remove="handleRemove(ingredient)"
				@blur="emit('blur')" />
		</ol>
		<p
			v-else
			class="rounded-md border border-dashed border-stroke-input px-4 py-6 text-center text-body-sm text-content-muted">
			{{ $t('organisms.ingredientsSelection.empty') }}
		</p>

		<ErrorMessage
			v-if="props.checkError('ingredients')"
			:value="props.checkError('ingredients')" />

		<!-- Announces adds, removals and moves to screen readers. -->
		<p class="sr-only" aria-live="polite" data-testid="ingredients-announcement">
			{{ announcement }}
		</p>
	</div>
</template>
<script setup lang="ts">
import { moveArrayElement, useSortable } from '@vueuse/integrations/useSortable';
import type { SortableEvent } from 'sortablejs';
import { nextTick, useId, useTemplateRef } from 'vue';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { DrinkIngredient } from '~/domain/drink/drink.entity';
import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import type { DrinkIngredientRequest } from '~/domain/drink/drink.dtos';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { mapAmountToRequest } from '~/helpers/drink.helpers';
import { getIngredientSummary, getPrimaryUnit } from '~/helpers/ingredient.helpers';
import IngredientsSelectionItem from './IngredientsSelectionItem.vue';

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

const { t, locale } = useI18n();
const instructionsId = useId();
const {
	options,
	searchTerm,
	loading,
	selected,
	handleSelect,
	handleRemoveSelected,
	initSelected,
	moveSelected,
	loadNextPage
} = useIngredientSearch();

const quantities = ref<Record<string, number>>({});
// This list only edits exact amounts in the first unit of an ingredient. A line that came with any other amount
// (to taste, top up, none) or flagged as optional goes back as it was, until the amount can be edited here too.
const carriedLines = ref<Record<string, DrinkIngredientRequest>>({});
const announcement = ref('');

if (props.initialIngredients.length > 0) {
	initSelected(props.initialIngredients.map((di) => di.ingredient));
	props.initialIngredients.forEach((di) => {
		if (di.amount.type === DrinkIngredientAmountTypes.exact) {
			quantities.value[di.ingredient.id] = di.amount.quantity;
		}
		if (di.amount.type !== DrinkIngredientAmountTypes.exact || di.optional) {
			carriedLines.value[di.ingredient.id] = {
				ingredientId: di.ingredient.id,
				amount: mapAmountToRequest(di.amount),
				optional: di.optional
			};
		}
	});
}

// Ingredients already in the list are filtered out by the search composable.
const searchOptions = computed<InputSelectOption[]>(() =>
	options.value.map((ingredient) => ({
		label: ingredient.translations[locale.value].name,
		value: ingredient.id,
		description: getIngredientSummary(ingredient, locale.value)
	}))
);

const nameOf = (ingredient: Ingredient) => ingredient.translations[locale.value].name;

const emitIngredients = () => {
	const ingredients: DrinkIngredientRequest[] = selected.value.map(
		(sel) =>
			carriedLines.value[sel.id] ?? {
				ingredientId: sel.id,
				amount: {
					type: DrinkIngredientAmountTypes.exact,
					quantity: quantities.value[sel.id] || 0,
					unitId: getPrimaryUnit(sel)?.id ?? ''
				},
				optional: false
			}
	);
	emit('update:modelValue', ingredients);
};

const updateQuantity = (ingredientId: string, value: number) => {
	quantities.value[ingredientId] = value;
	emitIngredients();
};

const handleAdd = (option: InputSelectOption) => {
	handleSelect(option);
	announcement.value = t('organisms.ingredientsSelection.announcements.added', {
		name: option.label,
		total: selected.value.length
	});
};

const handleRemove = (ingredient: Ingredient) => {
	handleRemoveSelected({ label: '', value: ingredient.id });
	const { [ingredient.id]: _, ...rest } = quantities.value;
	quantities.value = rest;
	const { [ingredient.id]: __, ...restCarried } = carriedLines.value;
	carriedLines.value = restCarried;
	announcement.value = t('organisms.ingredientsSelection.announcements.removed', {
		name: nameOf(ingredient)
	});
	emitIngredients();
};

const announceMove = (ingredient: Ingredient, position: number) => {
	announcement.value = t('organisms.ingredientsSelection.announcements.moved', {
		name: nameOf(ingredient),
		position: position + 1,
		total: selected.value.length
	});
};

// The up/down buttons; dragging goes through `handleSortUpdate` below.
const move = (from: number, to: number) => {
	const ingredient = selected.value[from];
	if (!ingredient || to < 0 || to >= selected.value.length) return;
	moveSelected(from, to);
	announceMove(ingredient, to);
};

/**
 * Drop handler (VueUse "custom update handler" pattern): `moveArrayElement` puts the dragged
 * node back where Vue rendered it and reorders `selected` in a microtask, so the move is
 * announced on the next tick, once the list holds the new order.
 */
const handleSortUpdate = (event: SortableEvent) => {
	const { oldIndex, newIndex } = event;
	if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
	moveArrayElement(selected, oldIndex, newIndex, event);
	void nextTick(() => {
		const ingredient = selected.value[newIndex];
		if (ingredient) announceMove(ingredient, newIndex);
	});
};

// The list only renders with at least one ingredient, so Sortable follows the element.
useSortable(useTemplateRef<HTMLElement>('sortableList'), selected, {
	watchElement: true,
	handle: '[data-drag-handle]',
	animation: 150,
	ghostClass: 'ingredients-selection-ghost',
	chosenClass: 'ingredients-selection-chosen',
	onUpdate: handleSortUpdate
});

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
<style scoped>
@reference "~/styles/global.css";

/* Where the dragged ingredient will land. */
:deep(.ingredients-selection-ghost) {
	@apply border-dashed border-accent-content bg-accent-subtle opacity-70;
}

/* The ingredient being dragged. */
:deep(.ingredients-selection-chosen) {
	@apply border-focus-ring shadow-overlay;
}
</style>
