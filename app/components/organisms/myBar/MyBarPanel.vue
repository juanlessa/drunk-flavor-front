<template>
	<section
		:aria-labelledby="headingId"
		class="flex flex-col gap-4 rounded-card border border-stroke bg-surface p-4 shadow-card tablet:p-5">
		<div class="flex flex-wrap items-center justify-between gap-x-3">
			<h2 :id="headingId" class="text-body font-bold text-content">
				{{ $t('organisms.myBar.ingredients.label') }}
				<span class="font-medium text-content-muted">
					{{
						$t('organisms.myBar.ingredients.count', { count: props.ingredients.length })
					}}
				</span>
			</h2>
			<button
				v-if="props.ingredients.length"
				type="button"
				class="min-h-11 whitespace-nowrap rounded-option px-1 text-body-sm font-medium text-accent-content hover:text-accent-content-hover focus-visible:outline-hidden focus-visible:shadow-focus-ring"
				@click="handleClear">
				{{ $t('organisms.myBar.ingredients.clear') }}
			</button>
		</div>
		<div class="flex flex-col gap-1">
			<Label :for="searchId" class="sr-only">
				{{ $t('organisms.myBar.ingredients.searchLabel') }}
			</Label>
			<Search
				:id="searchId"
				v-model:search-term="searchTerm"
				:options="searchOptions"
				:placeholder="$t('organisms.myBar.ingredients.searchPlaceholder')"
				:no-result="$t('organisms.myBar.ingredients.noResult')"
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
			<p
				v-if="props.isFull"
				class="text-body-sm text-content-muted"
				data-testid="my-bar-full">
				{{ $t('organisms.myBar.ingredients.full', { max: DRINK_MATCH_MAX_INGREDIENTS }) }}
			</p>
		</div>
		<ul
			v-if="props.ingredients.length"
			class="flex flex-wrap gap-2"
			:aria-label="$t('organisms.myBar.ingredients.label')">
			<li
				v-for="ingredient in props.ingredients"
				:key="ingredient.id"
				class="inline-flex min-h-9 items-center gap-1 rounded-full border border-accent-content/25 bg-accent-subtle pl-3 pr-1 text-body-sm font-medium text-accent-content">
				<span>{{ nameOf(ingredient) }}</span>
				<button
					type="button"
					class="inline-flex size-7 items-center justify-center rounded-full hover:bg-surface-hover focus-visible:outline-hidden focus-visible:shadow-focus-ring-flat"
					:aria-label="
						$t('organisms.myBar.ingredients.remove', { name: nameOf(ingredient) })
					"
					@click="handleRemove(ingredient)">
					<span aria-hidden="true" class="text-caption leading-none">✕</span>
				</button>
			</li>
		</ul>
		<p class="text-caption text-content-muted">
			{{ $t('organisms.myBar.ingredients.savedHint') }}
		</p>
		<div class="h-px bg-stroke" aria-hidden="true"></div>
		<div class="flex flex-col gap-2">
			<p class="text-body font-bold text-content" aria-hidden="true">
				{{ $t('organisms.myBar.mode.label') }}
			</p>
			<RadioCardGroup
				:id="modeId"
				name="maxMissing"
				layout="filter"
				:label="$t('organisms.myBar.mode.label')"
				:model-value="String(props.maxMissing)"
				:options="modeOptions"
				@update:model-value="handleModeUpdate" />
		</div>
		<!-- Announces adds and removals to screen readers. -->
		<p class="sr-only" aria-live="polite" data-testid="my-bar-announcement">
			{{ announcement }}
		</p>
	</section>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { RadioCardOption } from '~/components/molecules/radioCardGroup/RadioCardGroup.types';
import { DRINK_MATCH_MAX_INGREDIENTS, drinkMatchMaxMissing } from '~/domain/drink/drink.constants';
import type { DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { getIngredientSummary } from '~/helpers/ingredient.helpers';
import type { BarIngredient } from '~/types/myBar.types';

const props = defineProps({
	ingredients: { type: Array as PropType<readonly BarIngredient[]>, default: () => [] },
	maxMissing: { type: [Number, String] as PropType<DrinkMatchMaxMissing>, default: 0 },
	/** The bar holds as many ingredients as the match accepts, so no other can be added. */
	isFull: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'add', ingredient: Ingredient): void;
	(e: 'remove', id: string): void;
	(e: 'clear'): void;
	(e: 'update:maxMissing', value: DrinkMatchMaxMissing): void;
}>();

const { t, locale } = useI18n();
const headingId = useId();
const searchId = useId();
const modeId = useId();
const announcement = ref('');

const { options, searchTerm, loading, loadNextPage } = useIngredientSearch('myBar');

// The search only knows what it fetched; the ingredients already in the bar are left out here.
const searchOptions = computed<InputSelectOption[]>(() =>
	options.value
		.filter((ingredient) => !props.ingredients.some(({ id }) => id === ingredient.id))
		.map((ingredient) => ({
			label: ingredient.translations[locale.value].name,
			value: ingredient.id,
			description: getIngredientSummary(ingredient, locale.value)
		}))
);

const modeOptions = computed<RadioCardOption[]>(() =>
	drinkMatchMaxMissing.map((value) => ({
		value: String(value),
		label: t(`organisms.myBar.mode.options.${value}`)
	}))
);

const nameOf = (ingredient: BarIngredient) => ingredient.translations[locale.value].name;

const handleAdd = (option: InputSelectOption) => {
	if (props.isFull) return;
	const ingredient = options.value.find(({ id }) => id === option.value);
	if (!ingredient) return;
	emit('add', ingredient);
	announcement.value = t('organisms.myBar.announcements.added', {
		name: ingredient.translations[locale.value].name
	});
};
const handleRemove = (ingredient: BarIngredient) => {
	emit('remove', ingredient.id);
	announcement.value = t('organisms.myBar.announcements.removed', { name: nameOf(ingredient) });
};
const handleClear = () => {
	emit('clear');
	announcement.value = t('organisms.myBar.announcements.cleared');
};
const handleModeUpdate = (value: string) => {
	const maxMissing = drinkMatchMaxMissing.find((option) => String(option) === value);
	if (maxMissing !== undefined) emit('update:maxMissing', maxMissing);
};

/** Moves the focus to the ingredient search, so a person can go on adding ingredients. */
const focusSearch = () => document.getElementById(searchId)?.focus();
defineExpose({ focusSearch });
</script>
