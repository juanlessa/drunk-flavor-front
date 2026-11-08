<template>
	<div class="flex flex-col gap-3">
		<InputWrapper>
			<template #label>
				<Label for="units">{{ $t('organisms.ingredientForm.unitsSelection.label') }}</Label>
			</template>
			<InputSelectSearchable
				id="units"
				v-model="selected"
				v-model:search-term="searchTerm"
				:options="mapToSelectOptions(availableUnits, locale)"
				:placeholder="$t('organisms.ingredientForm.unitsSelection.addPlaceholder')"
				:no-result="$t('organisms.ingredientForm.unitsSelection.noResult')"
				infinite-scroll
				server-filtered
				:loading="loading"
				:has-error="!!props.error"
				@update:model-value="handleSelect"
				@load-more="loadNextPage"
				@blur="emit('blur')" />
			<Text class="text-body-sm text-content-muted">
				{{ $t('organisms.ingredientForm.unitsSelection.help') }}
			</Text>
			<template #error>
				<ErrorMessage :value="props.error" />
			</template>
		</InputWrapper>
		<ol
			v-if="props.units.length"
			class="flex flex-col gap-2"
			:aria-label="$t('organisms.ingredientForm.unitsSelection.label')">
			<li
				v-for="(unit, index) in props.units"
				:key="unit.id"
				class="flex items-center gap-2 rounded-md border border-stroke bg-surface p-3">
				<div class="min-w-0 flex-1">
					<p class="flex flex-wrap items-center gap-2 font-medium text-content">
						<span class="truncate">{{ index + 1 }}. {{ nameOf(unit) }}</span>
						<Badge
							v-if="index === 0"
							tone="accent"
							:value="$t('organisms.ingredientForm.unitsSelection.defaultBadge')" />
					</p>
					<p class="truncate text-body-sm text-content-muted">{{ summaryOf(unit) }}</p>
				</div>
				<button
					type="button"
					:class="iconButtonStyle()"
					:disabled="index === 0"
					:aria-label="
						$t('organisms.ingredientForm.unitsSelection.moveUp.label', {
							name: nameOf(unit)
						})
					"
					@click="move(index, -1)">
					<ArrowUpIcon class="fill-current" aria-hidden="true" />
				</button>
				<button
					type="button"
					:class="iconButtonStyle()"
					:disabled="index === props.units.length - 1"
					:aria-label="
						$t('organisms.ingredientForm.unitsSelection.moveDown.label', {
							name: nameOf(unit)
						})
					"
					@click="move(index, 1)">
					<ArrowDownIcon class="fill-current" aria-hidden="true" />
				</button>
				<button
					type="button"
					:class="iconButtonStyle({ tone: 'danger' })"
					:aria-label="
						$t('organisms.ingredientForm.unitsSelection.remove.label', {
							name: nameOf(unit)
						})
					"
					@click="remove(index)">
					<TrashIcon class="fill-current" aria-hidden="true" />
				</button>
			</li>
		</ol>
		<Text v-else class="text-body-sm text-content-muted">
			{{ $t('organisms.ingredientForm.unitsSelection.empty') }}
		</Text>
	</div>
</template>
<script setup lang="ts">
import { mapToSelectOptions } from '~/components/atoms/inputSelect/InputSelect.helpers';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { Unit } from '~/domain/unit/unit.entity';
import { moveItem } from '~/helpers/array';
import { getUnitSummary } from '~/helpers/unit.helpers';
import { tv } from '~/utils/tv';

const props = defineProps({
	/** The units picked so far, in display order. The first one is the default. */
	units: { type: Array as PropType<Unit[]>, default: () => [] },
	error: { type: String, default: '' }
});
const emit = defineEmits<{
	(e: 'update:units', value: Unit[]): void;
	(e: 'blur'): void;
}>();

const { t, locale } = useI18n();
const { options, searchTerm, loading, selected, loadNextPage } = useUnitSearchableSelect();

// A unit can be added once, so the ones already in the list are not offered again.
const availableUnits = computed(() =>
	options.value.filter((option) => !props.units.some((unit) => unit.id === option.id))
);

const nameOf = (unit: Unit) => unit.translations[locale.value].name;
const summaryOf = (unit: Unit) =>
	getUnitSummary(unit, t(`organisms.unitForm.kindInput.options.${unit.kind}`));

const handleSelect = (option: InputSelectOption) => {
	const unit = options.value.find((candidate) => candidate.id === option.value);
	if (!unit) return;
	emit('update:units', [...props.units, unit]);
	// The select only picks; the chosen unit moves to the list below it.
	selected.value = { label: '', value: '' };
	searchTerm.value = '';
};

const move = (index: number, step: -1 | 1) => {
	emit('update:units', moveItem(props.units, index, index + step));
	emit('blur');
};

const remove = (index: number) => {
	emit(
		'update:units',
		props.units.filter((_, position) => position !== index)
	);
	emit('blur');
};

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
