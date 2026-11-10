<template>
	<li
		class="flex flex-col gap-3 rounded-md border border-stroke bg-surface p-3"
		data-testid="recipe-line">
		<!-- Mirrors RecipeLineItem without its controls: no moves or removal, values instead of inputs. -->
		<div class="min-w-0">
			<p class="truncate font-medium text-content">{{ props.index + 1 }}. {{ name }}</p>
			<p class="truncate text-body-sm text-content-muted">{{ summary }}</p>
		</div>
		<!-- Same grid as the form; each field is its own description list, as fields nest in wrappers. -->
		<div class="grid grid-cols-1 gap-3 tablet:grid-cols-[11rem_1fr] tablet:items-start">
			<dl>
				<ReadOnlyInput
					:label="$t('organisms.recipeLines.amountType.label')"
					:value="$t(`organisms.recipeLines.amountType.options.${amount.type}`)"
					data-testid="amount-type" />
			</dl>
			<div v-if="amount.type === DrinkIngredientAmountTypes.exact" class="flex gap-3">
				<dl class="min-w-0 flex-1">
					<ReadOnlyInput
						:label="$t('organisms.recipeLines.quantity.label')"
						data-testid="quantity">
						<QuantityValue :quantity="amount.quantity" :suffix="singleUnitSuffix" />
					</ReadOnlyInput>
				</dl>
				<dl v-if="hasUnitChoice" class="w-32 shrink-0">
					<ReadOnlyInput
						:label="$t('organisms.recipeLines.unit.label')"
						:value="unitLabel"
						data-testid="unit" />
				</dl>
			</div>
			<div
				v-else-if="amount.type === DrinkIngredientAmountTypes.qualitative"
				class="flex flex-col gap-3">
				<dl>
					<ReadOnlyInput
						:label="$t('organisms.recipeLines.qualifier.label')"
						:value="$t(`organisms.recipeLines.qualifier.options.${amount.qualifier}`)"
						data-testid="qualifier" />
				</dl>
				<div v-if="hasUnits" class="flex gap-3">
					<dl class="min-w-0 flex-1">
						<ReadOnlyInput
							v-if="amount.quantity !== undefined"
							:label="$t('organisms.recipeLines.hint.label')"
							data-testid="hint">
							<QuantityValue :quantity="amount.quantity" :suffix="singleUnitSuffix" />
						</ReadOnlyInput>
						<!-- The hint is optional: without it the field is empty, like in the form. -->
						<ReadOnlyInput
							v-else
							:label="$t('organisms.recipeLines.hint.label')"
							data-testid="hint" />
					</dl>
					<dl v-if="hasUnitChoice" class="w-32 shrink-0">
						<ReadOnlyInput
							:label="$t('organisms.recipeLines.unit.label')"
							:value="amount.quantity === undefined ? '' : unitLabel"
							data-testid="unit" />
					</dl>
				</div>
			</div>
			<Text v-else class="text-body-sm text-content-muted tablet:pt-8">
				{{ $t('organisms.recipeLines.amountType.noneHelp') }}
			</Text>
		</div>
		<div
			v-if="props.kind === 'ingredients'"
			class="flex items-center justify-between gap-4"
			data-testid="toggle-optional">
			<div class="min-w-0">
				<p class="text-body font-regular text-content">
					{{ $t('organisms.recipeLines.optional.label') }}
				</p>
				<Text class="text-body-sm text-content-muted">
					{{ $t('organisms.recipeLines.optional.help') }}
				</Text>
			</div>
			<ReadOnlySwitch :checked="isOptional" />
		</div>
	</li>
</template>
<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import type { DrinkGarnish, DrinkIngredient } from '~/domain/drink/drink.entity';
import type { Unit } from '~/domain/unit/unit.entity';
import { getIngredientSummary } from '~/helpers/ingredient.helpers';
import { formatQuantityValue } from '~/helpers/unit.helpers';

const props = defineProps({
	line: { type: Object as PropType<DrinkIngredient | DrinkGarnish>, required: true },
	index: { type: Number, required: true },
	/** Garnishes have no optional switch: they are optional by nature. */
	kind: { type: String as PropType<'ingredients' | 'garnishes'>, required: true }
});

const { locale } = useI18n();

const name = computed(() => props.line.ingredient.translations[locale.value].name);
const summary = computed(() => getIngredientSummary(props.line.ingredient, locale.value));
const amount = computed(() => props.line.amount);
const isOptional = computed(() => 'optional' in props.line && props.line.optional === true);

// The same rules as the form: a unit field only when the ingredient offers more than one unit.
const units = computed(() => props.line.ingredient.units);
const hasUnits = computed(() => units.value.length > 0);
const hasUnitChoice = computed(() => units.value.length > 1);
// The unit saved with the line, or the default (first) unit of the ingredient.
const selectedUnit = computed<Unit | undefined>(() => {
	const current = amount.value;
	const saved = 'unit' in current ? current.unit : undefined;
	return saved ?? units.value[0];
});

// A unit written with the ingredient name is shown as that name ("limes"), as in the form.
const unitName = (unit: Unit) => {
	if (unit.useIngredientName) {
		const { name, namePlural } = props.line.ingredient.translations[locale.value];
		return namePlural || name;
	}
	return unit.symbol || unit.translations[locale.value]?.name || '';
};
const unitLabel = computed(() => (selectedUnit.value ? unitName(selectedUnit.value) : ''));
// With a single unit there is nothing to choose, so it is written next to the number, as in the form.
const singleUnitSuffix = computed(() => (hasUnitChoice.value ? '' : unitLabel.value));

/** The number as typed in the form's number input, followed by its muted unit suffix. */
const QuantityValue = defineComponent({
	props: {
		quantity: { type: Number, required: true },
		suffix: { type: String, default: '' }
	},
	setup: (valueProps) => () =>
		h('span', { class: 'inline-flex items-center gap-2' }, [
			h('span', formatQuantityValue(valueProps.quantity, locale.value)),
			valueProps.suffix ? h('span', { class: 'text-content-muted' }, valueProps.suffix) : null
		])
});
</script>
