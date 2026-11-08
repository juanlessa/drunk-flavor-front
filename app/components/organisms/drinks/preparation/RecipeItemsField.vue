<template>
	<InputWrapper>
		<template #label>
			<Label :for="props.id">{{ props.label }}</Label>
		</template>
		<!-- One item: a plain select. -->
		<InputSelect
			v-if="!props.multiple"
			:id="props.id"
			:model-value="singleValue"
			:options="singleOptions"
			:placeholder="$t('organisms.preparationBuilder.items.placeholder')"
			:has-error="!!props.error"
			@update:model-value="handleSingleUpdate" />
		<!-- Several items: the chosen ones as rows, and a select that adds the next. -->
		<template v-else>
			<ul v-if="props.modelValue.length" class="flex flex-col gap-2">
				<li
					v-for="item in props.modelValue"
					:key="getRecipeItemKey(item)"
					class="flex items-center gap-2 rounded-md border bg-surface px-3 py-2"
					:class="isMissing(item) ? 'border-danger-stroke' : 'border-stroke'">
					<div class="min-w-0 flex-1">
						<p
							class="truncate text-body"
							:class="isMissing(item) ? 'text-danger' : 'text-content'">
							{{ describe(item) }}
						</p>
						<p v-if="isMissing(item)" class="text-body-sm text-danger">
							{{ $t('organisms.preparationBuilder.items.missing') }}
						</p>
					</div>
					<div v-if="item.unitId" class="flex shrink-0 items-center gap-2">
						<Label
							:for="`${props.id}-unit-${getRecipeItemKey(item)}`"
							class="text-body-sm">
							{{ $t('organisms.preparationBuilder.items.withUnit') }}
						</Label>
						<InputSwitch
							:id="`${props.id}-unit-${getRecipeItemKey(item)}`"
							:checked="!!item.withUnit"
							@update:checked="(value) => handleWithUnit(item, value)" />
					</div>
					<button
						type="button"
						:class="removeButtonStyle"
						:aria-label="
							$t('organisms.preparationBuilder.items.remove', {
								name: describe(item)
							})
						"
						@click="handleRemove(item)">
						<TrashIcon class="fill-current" aria-hidden="true" />
					</button>
				</li>
			</ul>
			<InputSelect
				:id="props.id"
				:key="addKey"
				model-value=""
				:options="addOptions"
				:placeholder="$t('organisms.preparationBuilder.items.addPlaceholder')"
				:has-error="!!props.error"
				@update:model-value="handleAdd" />
		</template>
		<template #error>
			<ErrorMessage :value="props.error" />
		</template>
	</InputWrapper>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { RecipeItemRef } from '~/domain/preparation/preparation.entity';
import { getRecipeItemKey, type RecipeItemChoice } from '~/helpers/recipe.helpers';

const props = defineProps({
	/** The items chosen. A single-item field keeps a list of one (or none). */
	modelValue: { type: Array as PropType<RecipeItemRef[]>, default: () => [] },
	/** The recipe lines the action can point at. */
	choices: { type: Array as PropType<RecipeItemChoice[]>, default: () => [] },
	multiple: { type: Boolean, default: false },
	label: { type: String, required: true },
	id: { type: String, required: true },
	error: { type: String, default: '' }
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: RecipeItemRef[]): void;
}>();

const { t } = useI18n();

const choiceByKey = computed(() => new Map(props.choices.map((choice) => [choice.key, choice])));
// More than one list can be offered (a custom step takes from both), and then the name says which one.
const hasSeveralLists = computed(() => new Set(props.choices.map(({ list }) => list)).size > 1);

const describeChoice = (choice: RecipeItemChoice) =>
	[
		choice.name,
		choice.unitName,
		hasSeveralLists.value ? t(`organisms.preparationBuilder.items.lists.${choice.list}`) : ''
	]
		.filter(Boolean)
		.join(' · ');

/** An item whose recipe line was removed or changed unit since it was chosen. */
const isMissing = (item: RecipeItemRef) => !choiceByKey.value.has(getRecipeItemKey(item));
const describe = (item: RecipeItemRef) => {
	const choice = choiceByKey.value.get(getRecipeItemKey(item));
	return choice ? describeChoice(choice) : t('organisms.preparationBuilder.items.unknown');
};

// --- single ---
const singleValue = computed(() => {
	const [item] = props.modelValue;
	return item && item.ingredientId ? getRecipeItemKey(item) : '';
});
const singleOptions = computed<InputSelectOption[]>(() => {
	const options = props.choices.map((choice) => ({
		label: describeChoice(choice),
		value: choice.key
	}));
	const [item] = props.modelValue;
	// A stale choice stays visible so it can be seen and replaced.
	if (item && item.ingredientId && isMissing(item)) {
		options.unshift({
			label: t('organisms.preparationBuilder.items.unknown'),
			value: getRecipeItemKey(item)
		});
	}
	return options;
});
const handleSingleUpdate = (key: string) => {
	const choice = choiceByKey.value.get(key);
	if (choice) emit('update:modelValue', [choice.ref]);
};

// --- several ---
const addKey = ref(0);
const addOptions = computed<InputSelectOption[]>(() =>
	props.choices
		.filter((choice) => !props.modelValue.some((item) => getRecipeItemKey(item) === choice.key))
		.map((choice) => ({ label: describeChoice(choice), value: choice.key }))
);
const handleAdd = (key: string) => {
	const choice = choiceByKey.value.get(key);
	if (!choice) return;
	emit('update:modelValue', [...props.modelValue, choice.ref]);
	// The select shows what was picked; a new key puts it back on its placeholder for the next item.
	addKey.value += 1;
};
const handleRemove = (item: RecipeItemRef) =>
	emit(
		'update:modelValue',
		props.modelValue.filter((current) => getRecipeItemKey(current) !== getRecipeItemKey(item))
	);
const handleWithUnit = (item: RecipeItemRef, withUnit: boolean) =>
	emit(
		'update:modelValue',
		props.modelValue.map((current) =>
			getRecipeItemKey(current) === getRecipeItemKey(item)
				? { ...current, withUnit }
				: current
		)
	);

const removeButtonStyle =
	'inline-flex size-10 shrink-0 items-center justify-center rounded-icon-action text-content-muted cursor-pointer transition-colors duration-short hover:bg-danger-surface hover:text-danger focus-visible:outline-hidden focus-visible:shadow-focus-ring tablet:size-8';
</script>
