<template>
	<li class="flex flex-col gap-3 rounded-md border border-stroke bg-surface p-3">
		<!-- Identity and moves on one band; the amount controls get their own below. -->
		<div class="flex items-start gap-2">
			<div class="min-w-0 flex-1">
				<p class="truncate font-medium text-content">{{ props.index + 1 }}. {{ name }}</p>
				<p class="truncate text-body-sm text-content-muted">{{ summary }}</p>
			</div>
			<button
				type="button"
				:class="iconButtonStyle()"
				:disabled="props.index === 0"
				:aria-label="$t('organisms.recipeLines.moveUp.label', { name })"
				@click="emit('moveUp')">
				<ArrowUpIcon class="fill-current" aria-hidden="true" />
			</button>
			<button
				type="button"
				:class="iconButtonStyle()"
				:disabled="props.index === props.total - 1"
				:aria-label="$t('organisms.recipeLines.moveDown.label', { name })"
				@click="emit('moveDown')">
				<ArrowDownIcon class="fill-current" aria-hidden="true" />
			</button>
			<button
				type="button"
				:class="iconButtonStyle({ tone: 'danger' })"
				:aria-label="$t('organisms.recipeLines.removeButton.label', { name })"
				@click="emit('remove')">
				<TrashIcon class="fill-current" aria-hidden="true" />
			</button>
		</div>
		<div class="grid grid-cols-1 gap-3 tablet:grid-cols-[11rem_1fr] tablet:items-start">
			<InputWrapper>
				<template #label>
					<Label :for="`${idPrefix}-type`">
						{{ $t('organisms.recipeLines.amountType.label') }}
					</Label>
				</template>
				<InputSelect
					:id="`${idPrefix}-type`"
					:model-value="props.line.amount.type"
					:options="amountTypeOptions"
					@update:model-value="handleTypeUpdate" />
			</InputWrapper>
			<div v-if="amount.type === DrinkIngredientAmountTypes.exact" class="flex gap-3">
				<div class="min-w-0 flex-1">
					<InputWrapper>
						<template #label>
							<Label :for="`${idPrefix}-quantity`">
								{{ $t('organisms.recipeLines.quantity.label') }}
							</Label>
						</template>
						<InputNumber
							:id="`${idPrefix}-quantity`"
							:model-value="amount.quantity"
							:suffix="singleUnitSuffix"
							:integer="!selectedUnit?.allowDecimal"
							:has-error="!!props.quantityError"
							@update:model-value="handleQuantityUpdate"
							@blur="emit('blur')" />
						<template #error>
							<ErrorMessage :value="props.quantityError" />
						</template>
					</InputWrapper>
				</div>
				<div v-if="hasUnitChoice" class="w-32 shrink-0">
					<InputWrapper>
						<template #label>
							<Label :for="`${idPrefix}-unit`">
								{{ $t('organisms.recipeLines.unit.label') }}
							</Label>
						</template>
						<InputSelect
							:id="`${idPrefix}-unit`"
							:model-value="selectedUnitId"
							:options="unitOptions"
							:has-error="!!props.unitError"
							@update:model-value="handleUnitUpdate" />
						<template #error>
							<ErrorMessage :value="props.unitError" />
						</template>
					</InputWrapper>
				</div>
			</div>
			<div
				v-else-if="amount.type === DrinkIngredientAmountTypes.qualitative"
				class="flex flex-col gap-3">
				<InputWrapper>
					<template #label>
						<Label :for="`${idPrefix}-qualifier`">
							{{ $t('organisms.recipeLines.qualifier.label') }}
						</Label>
					</template>
					<InputSelect
						:id="`${idPrefix}-qualifier`"
						:model-value="amount.qualifier"
						:options="qualifierOptions"
						:has-error="!!props.qualifierError"
						@update:model-value="handleQualifierUpdate" />
					<template #error>
						<ErrorMessage :value="props.qualifierError" />
					</template>
				</InputWrapper>
				<div v-if="hasUnits" class="flex gap-3">
					<div class="min-w-0 flex-1">
						<InputWrapper>
							<template #label>
								<Label :for="`${idPrefix}-hint`">
									{{ $t('organisms.recipeLines.hint.label') }}
								</Label>
							</template>
							<InputNumber
								:id="`${idPrefix}-hint`"
								:model-value="amount.quantity ?? 0"
								:suffix="singleUnitSuffix"
								:integer="!selectedUnit?.allowDecimal"
								@update:model-value="handleQuantityUpdate"
								@blur="emit('blur')" />
						</InputWrapper>
					</div>
					<div v-if="hasUnitChoice" class="w-32 shrink-0">
						<InputWrapper>
							<template #label>
								<Label :for="`${idPrefix}-hint-unit`">
									{{ $t('organisms.recipeLines.unit.label') }}
								</Label>
							</template>
							<InputSelect
								:id="`${idPrefix}-hint-unit`"
								:model-value="selectedUnitId"
								:options="unitOptions"
								:has-error="!!props.unitError"
								@update:model-value="handleUnitUpdate" />
							<template #error>
								<ErrorMessage :value="props.unitError" />
							</template>
						</InputWrapper>
					</div>
				</div>
			</div>
			<Text v-else class="text-body-sm text-content-muted tablet:pt-8">
				{{ $t('organisms.recipeLines.amountType.noneHelp') }}
			</Text>
		</div>
		<div v-if="props.kind === 'ingredients'" class="flex items-center justify-between gap-4">
			<div class="min-w-0">
				<Label :for="`${idPrefix}-optional`">
					{{ $t('organisms.recipeLines.optional.label') }}
				</Label>
				<Text :id="`${idPrefix}-optional-help`" class="text-body-sm text-content-muted">
					{{ $t('organisms.recipeLines.optional.help') }}
				</Text>
			</div>
			<InputSwitch
				:id="`${idPrefix}-optional`"
				:checked="props.line.optional"
				class="shrink-0"
				:aria-describedby="`${idPrefix}-optional-help`"
				@update:checked="handleOptionalUpdate" />
		</div>
	</li>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import {
	DrinkIngredientAmountTypes,
	DrinkIngredientQualifiers,
	drinkIngredientQualifiers
} from '~/domain/drink/drink.constants';
import type { DrinkIngredientAmountRequest } from '~/domain/drink/drink.dtos';
import type { DrinkIngredientQualifier } from '~/domain/drink/drink.entity';
import { getIngredientSummary } from '~/helpers/ingredient.helpers';
import type { DrinkRecipeLineForm } from '~/types/drink.types';
import { tv } from '~/utils/tv';

const props = defineProps({
	line: { type: Object as PropType<DrinkRecipeLineForm>, required: true },
	index: { type: Number, required: true },
	total: { type: Number, required: true },
	/** Garnishes have no optional switch: they are optional by nature. */
	kind: { type: String as PropType<'ingredients' | 'garnishes'>, required: true },
	idPrefix: { type: String, required: true },
	quantityError: { type: String, default: '' },
	unitError: { type: String, default: '' },
	qualifierError: { type: String, default: '' }
});
const emit = defineEmits<{
	(e: 'update:line', value: DrinkRecipeLineForm): void;
	(e: 'moveUp' | 'moveDown' | 'remove' | 'blur'): void;
}>();

const { t, locale } = useI18n();

const name = computed(() => props.line.ingredient.translations[locale.value].name);
const summary = computed(() => getIngredientSummary(props.line.ingredient, locale.value));
const amount = computed(() => props.line.amount);

const units = computed(() => props.line.ingredient.units);
const hasUnits = computed(() => units.value.length > 0);
const hasUnitChoice = computed(() => units.value.length > 1);
// The first unit of the ingredient is the default whenever none is chosen.
const defaultUnitId = computed(() => units.value[0]?.id ?? '');
const selectedUnitId = computed(() => {
	const current = props.line.amount;
	return 'unitId' in current && current.unitId ? current.unitId : defaultUnitId.value;
});
const selectedUnit = computed(() => units.value.find(({ id }) => id === selectedUnitId.value));

const unitName = (unit: { symbol?: string; translations: Record<string, { name: string }> }) =>
	unit.symbol || unit.translations[locale.value]?.name || '';

const unitOptions = computed<InputSelectOption[]>(() =>
	units.value.map((unit) => ({ label: unitName(unit), value: unit.id }))
);
// With a single unit there is nothing to choose, so it is written next to the number, like on the drink page.
const singleUnitSuffix = computed(() => {
	if (hasUnitChoice.value || !selectedUnit.value) return '';
	return unitName(selectedUnit.value);
});

// An ingredient with no units cannot have an exact amount.
const amountTypeOptions = computed<InputSelectOption[]>(() =>
	Object.values(DrinkIngredientAmountTypes)
		.filter((type) => type !== DrinkIngredientAmountTypes.exact || hasUnits.value)
		.map((type) => ({
			label: t(`organisms.recipeLines.amountType.options.${type}`),
			value: type
		}))
);
const qualifierOptions = computed<InputSelectOption[]>(() =>
	drinkIngredientQualifiers.map((qualifier) => ({
		label: t(`organisms.recipeLines.qualifier.options.${qualifier}`),
		value: qualifier
	}))
);

const update = (changes: Partial<DrinkRecipeLineForm>) =>
	emit('update:line', { ...props.line, ...changes });

const handleTypeUpdate = (type: string) => {
	const current = props.line.amount;
	const quantity = 'quantity' in current ? (current.quantity ?? 0) : 0;
	let next: DrinkIngredientAmountRequest;
	if (type === DrinkIngredientAmountTypes.exact) {
		next = { type, quantity, unitId: selectedUnitId.value };
	} else if (type === DrinkIngredientAmountTypes.qualitative) {
		const qualifier =
			'qualifier' in current ? current.qualifier : DrinkIngredientQualifiers.toTaste;
		next = { type, qualifier };
	} else if (type === DrinkIngredientAmountTypes.none) {
		next = { type };
	} else {
		return;
	}
	update({ amount: next });
};

const handleQuantityUpdate = (quantity: number) => {
	const current = props.line.amount;
	if (current.type === DrinkIngredientAmountTypes.exact) {
		update({ amount: { ...current, quantity } });
	} else if (current.type === DrinkIngredientAmountTypes.qualitative) {
		// A hint always names its unit, so the default one is filled in with the first quantity.
		update({
			amount: { ...current, quantity, unitId: current.unitId || selectedUnitId.value }
		});
	}
};

const handleUnitUpdate = (unitId: string) => {
	const current = props.line.amount;
	if (current.type === DrinkIngredientAmountTypes.exact) {
		update({ amount: { ...current, unitId } });
	} else if (current.type === DrinkIngredientAmountTypes.qualitative) {
		update({ amount: { ...current, unitId } });
	}
};

const isQualifier = (value: string): value is DrinkIngredientQualifier =>
	(drinkIngredientQualifiers as readonly string[]).includes(value);

const handleQualifierUpdate = (qualifier: string) => {
	const current = props.line.amount;
	if (current.type === DrinkIngredientAmountTypes.qualitative && isQualifier(qualifier)) {
		update({ amount: { ...current, qualifier } });
	}
};

const handleOptionalUpdate = (optional: boolean) => update({ optional });

// 40px touch targets on mobile, compact from tablet up.
const iconButtonStyle = tv({
	base: 'inline-flex size-10 shrink-0 items-center justify-center rounded-icon-action bg-surface-control text-content-muted cursor-pointer transition-colors duration-short focus-visible:outline-hidden focus-visible:shadow-focus-ring enabled:hover:bg-surface-control-hover disabled:cursor-not-allowed disabled:opacity-disabled tablet:size-8 tablet:bg-surface-transparent tablet:enabled:hover:bg-surface-hover',
	variants: {
		tone: {
			default: '',
			danger: 'hover:bg-danger-surface hover:text-danger'
		}
	},
	defaultVariants: { tone: 'default' }
});
</script>
