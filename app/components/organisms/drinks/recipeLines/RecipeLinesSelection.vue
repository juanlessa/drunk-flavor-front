<template>
	<div class="flex flex-col gap-5">
		<div class="flex flex-col gap-2">
			<Label :for="searchId">
				{{ $t(`organisms.recipeLines.kinds.${props.kind}.searchLabel`) }}
			</Label>
			<Search
				:id="searchId"
				v-model:search-term="searchTerm"
				:options="searchOptions"
				:placeholder="$t(`organisms.recipeLines.kinds.${props.kind}.searchPlaceholder`)"
				:no-result="$t('organisms.recipeLines.noResult')"
				infinite-scroll
				server-filtered
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
		<ol v-if="props.lines.length" class="flex flex-col gap-2">
			<RecipeLineItem
				v-for="(line, index) in props.lines"
				:key="line.ingredient.id"
				:line="line"
				:index="index"
				:total="props.lines.length"
				:kind="props.kind"
				:id-prefix="`${props.kind}-${line.ingredient.id}`"
				:quantity-error="props.checkError(`${props.kind}.${index}.amount.quantity`)"
				:unit-error="props.checkError(`${props.kind}.${index}.amount.unitId`)"
				:qualifier-error="props.checkError(`${props.kind}.${index}.amount.qualifier`)"
				@update:line="(value) => updateLine(index, value)"
				@move-up="move(index, index - 1)"
				@move-down="move(index, index + 1)"
				@remove="remove(index)"
				@blur="emit('blur')" />
		</ol>
		<p
			v-else
			class="rounded-md border border-dashed border-stroke-input px-4 py-6 text-center text-body-sm text-content-muted">
			{{ $t(`organisms.recipeLines.kinds.${props.kind}.empty`) }}
		</p>
		<ErrorMessage v-if="props.checkError(props.kind)" :value="props.checkError(props.kind)" />
		<!-- Announces adds, removals and moves to screen readers. -->
		<p class="sr-only" aria-live="polite" data-testid="recipe-lines-announcement">
			{{ announcement }}
		</p>
	</div>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { moveItem } from '~/helpers/array';
import { getIngredientSummary } from '~/helpers/ingredient.helpers';
import type { DrinkRecipeLineForm } from '~/types/drink.types';
import RecipeLineItem from './RecipeLineItem.vue';

const props = defineProps({
	lines: { type: Array as PropType<DrinkRecipeLineForm[]>, default: () => [] },
	/** Each list searches on its own, so the ingredients and the garnishes do not share options. */
	kind: { type: String as PropType<'ingredients' | 'garnishes'>, required: true },
	checkError: {
		type: Function as PropType<(field: string) => string>,
		default: () => ''
	}
});
const emit = defineEmits<{
	(e: 'update:lines', value: DrinkRecipeLineForm[]): void;
	(e: 'blur'): void;
}>();

const { t, locale } = useI18n();
const searchId = computed(() => `search-${props.kind}`);
const announcement = ref('');

const { options, searchTerm, loading, loadNextPage } = useIngredientSearch(props.kind);

// The search composable only knows what it fetched; the ingredients already in the list are left out here.
const searchOptions = computed<InputSelectOption[]>(() =>
	options.value
		.filter((ingredient) => !props.lines.some((line) => line.ingredient.id === ingredient.id))
		.map((ingredient) => ({
			label: ingredient.translations[locale.value].name,
			value: ingredient.id,
			description: getIngredientSummary(ingredient, locale.value)
		}))
);

const nameOf = (ingredient: Ingredient) => ingredient.translations[locale.value].name;

/**
 * A new line starts as an exact amount in the first unit of the ingredient (the default), or with nothing to
 * measure when the ingredient has no units. The quantity of a garnish starts at one piece.
 */
const buildLine = (ingredient: Ingredient): DrinkRecipeLineForm => {
	const [firstUnit] = ingredient.units;
	return {
		ingredient,
		optional: false,
		amount: firstUnit
			? {
					type: DrinkIngredientAmountTypes.exact,
					quantity: props.kind === 'garnishes' ? 1 : 0,
					unitId: firstUnit.id
				}
			: { type: DrinkIngredientAmountTypes.none }
	};
};

const handleAdd = (option: InputSelectOption) => {
	const ingredient = options.value.find(({ id }) => id === option.value);
	if (!ingredient) return;
	emit('update:lines', [...props.lines, buildLine(ingredient)]);
	announcement.value = t('organisms.recipeLines.announcements.added', {
		name: nameOf(ingredient),
		total: props.lines.length + 1
	});
};

const updateLine = (index: number, line: DrinkRecipeLineForm) =>
	emit(
		'update:lines',
		props.lines.map((current, position) => (position === index ? line : current))
	);

const move = (from: number, to: number) => {
	const line = props.lines[from];
	if (!line || to < 0 || to >= props.lines.length) return;
	emit('update:lines', moveItem(props.lines, from, to));
	announcement.value = t('organisms.recipeLines.announcements.moved', {
		name: nameOf(line.ingredient),
		position: to + 1,
		total: props.lines.length
	});
};

const remove = (index: number) => {
	const line = props.lines[index];
	if (!line) return;
	emit(
		'update:lines',
		props.lines.filter((_, position) => position !== index)
	);
	announcement.value = t('organisms.recipeLines.announcements.removed', {
		name: nameOf(line.ingredient)
	});
};
</script>
