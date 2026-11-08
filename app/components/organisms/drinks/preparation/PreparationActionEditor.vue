<template>
	<div class="flex flex-col gap-4">
		<!-- prepare_glass -->
		<template v-if="glass">
			<InputWrapper>
				<template #label>
					<Label :for="id('mode')">{{
						$t('organisms.preparationBuilder.fields.mode')
					}}</Label>
				</template>
				<InputSelect
					:id="id('mode')"
					:model-value="glass.mode"
					:options="options('glassMode', glassPreparationModes)"
					@update:model-value="handleGlassMode" />
			</InputWrapper>
			<RecipeItemsField
				v-if="glassItem"
				:id="id('item')"
				:label="glassItemLabel"
				:model-value="hasItem(glassItem) ? [glassItem] : []"
				:choices="glassChoices"
				:error="props.errorOf('item')"
				@update:model-value="handleGlassItem" />
			<InputWrapper v-if="glass.mode === GlassPreparationModes.rim">
				<template #label>
					<Label :for="id('coverage')">
						{{ $t('organisms.preparationBuilder.fields.coverage') }}
					</Label>
				</template>
				<InputSelect
					:id="id('coverage')"
					:model-value="glassCoverage"
					:options="options('rimCoverage', rimCoverages)"
					@update:model-value="(value) => patch({ coverage: value })" />
			</InputWrapper>
		</template>
		<!-- add -->
		<template v-else-if="add">
			<RoleField
				:id="id('target')"
				:model-value="add.target"
				@update:model-value="(value) => patch({ target: value })" />
			<RecipeItemsField
				:id="id('items')"
				:label="$t('organisms.preparationBuilder.fields.addItems')"
				multiple
				:model-value="add.items"
				:choices="props.choices.ingredients"
				:error="props.errorOf('items')"
				@update:model-value="(value) => patch({ items: value })" />
		</template>
		<!-- add_ice -->
		<template v-else-if="addIce">
			<RoleField
				:id="id('target')"
				:model-value="addIce.target"
				@update:model-value="(value) => patch({ target: value })" />
			<InputWrapper>
				<template #label>
					<Label :for="id('ice')">{{
						$t('organisms.preparationBuilder.fields.iceKind')
					}}</Label>
				</template>
				<InputSelect
					:id="id('ice')"
					:model-value="addIce.kind"
					:options="options('iceKind', iceKinds)"
					@update:model-value="(value) => patch({ kind: value })" />
			</InputWrapper>
		</template>
		<!-- muddle -->
		<InputWrapper v-else-if="muddle">
			<template #label>
				<Label :for="id('intensity')">
					{{ $t('organisms.preparationBuilder.fields.intensity') }}
				</Label>
			</template>
			<InputSelect
				:id="id('intensity')"
				:model-value="muddle.intensity ?? ''"
				:options="options('intensity.muddle', intensities)"
				:placeholder="$t('organisms.preparationBuilder.fields.intensityDefault')"
				@update:model-value="(value) => patch({ intensity: value })" />
		</InputWrapper>
		<!-- shake -->
		<div v-else-if="shake" class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
			<InputWrapper>
				<template #label>
					<Label :for="id('intensity')">
						{{ $t('organisms.preparationBuilder.fields.intensity') }}
					</Label>
				</template>
				<InputSelect
					:id="id('intensity')"
					:model-value="shake.intensity ?? ''"
					:options="options('intensity.shake', intensities)"
					:placeholder="$t('organisms.preparationBuilder.fields.intensityDefault')"
					@update:model-value="(value) => patch({ intensity: value })" />
			</InputWrapper>
			<InputWrapper>
				<template #label>
					<Label :for="id('seconds')">
						{{ $t('organisms.preparationBuilder.fields.seconds') }}
					</Label>
				</template>
				<InputNumber
					:id="id('seconds')"
					integer
					:model-value="shake.seconds ?? 0"
					:has-error="!!props.errorOf('seconds')"
					:suffix="$t('organisms.preparationBuilder.fields.secondsSuffix')"
					@update:model-value="
						(value) => patch({ seconds: positiveOrUndefined(value) })
					" />
				<template #error>
					<ErrorMessage :value="props.errorOf('seconds')" />
				</template>
			</InputWrapper>
		</div>
		<!-- stir -->
		<div v-else-if="stir" class="grid grid-cols-1 gap-4 tablet:grid-cols-3">
			<InputWrapper>
				<template #label>
					<Label :for="id('intensity')">
						{{ $t('organisms.preparationBuilder.fields.intensity') }}
					</Label>
				</template>
				<InputSelect
					:id="id('intensity')"
					:model-value="stir.intensity ?? ''"
					:options="options('intensity.stir', intensities)"
					:placeholder="$t('organisms.preparationBuilder.fields.intensityDefault')"
					@update:model-value="(value) => patch({ intensity: value })" />
			</InputWrapper>
			<InputWrapper>
				<template #label>
					<Label :for="id('seconds')">
						{{ $t('organisms.preparationBuilder.fields.seconds') }}
					</Label>
				</template>
				<InputNumber
					:id="id('seconds')"
					integer
					:model-value="stir.seconds ?? 0"
					:has-error="!!props.errorOf('seconds')"
					:suffix="$t('organisms.preparationBuilder.fields.secondsSuffix')"
					@update:model-value="
						(value) => patch({ seconds: positiveOrUndefined(value) })
					" />
				<template #error>
					<ErrorMessage :value="props.errorOf('seconds')" />
				</template>
			</InputWrapper>
			<InputWrapper>
				<template #label>
					<Label :for="id('revolutions')">
						{{ $t('organisms.preparationBuilder.fields.revolutions') }}
					</Label>
				</template>
				<InputNumber
					:id="id('revolutions')"
					integer
					:model-value="stir.revolutions ?? 0"
					:has-error="!!props.errorOf('revolutions')"
					:suffix="$t('organisms.preparationBuilder.fields.revolutionsSuffix')"
					@update:model-value="
						(value) => patch({ revolutions: positiveOrUndefined(value) })
					" />
				<template #error>
					<ErrorMessage :value="props.errorOf('revolutions')" />
				</template>
			</InputWrapper>
		</div>
		<!-- strain -->
		<template v-else-if="strain">
			<div class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
				<InputWrapper>
					<template #label>
						<Label :for="id('strain')">
							{{ $t('organisms.preparationBuilder.fields.strainKind') }}
						</Label>
					</template>
					<InputSelect
						:id="id('strain')"
						:model-value="strain.kind"
						:options="options('strainKind', strainKinds)"
						@update:model-value="(value) => patch({ kind: value })" />
				</InputWrapper>
				<InputWrapper>
					<template #label>
						<Label :for="id('to')">
							{{ $t('organisms.preparationBuilder.fields.strainTo') }}
						</Label>
					</template>
					<InputSelect
						:id="id('to')"
						:model-value="strain.to ?? VesselRoles.serving"
						:options="options('strainTo', vesselRoles)"
						@update:model-value="handleStrainTo" />
				</InputWrapper>
			</div>
			<div
				v-if="strain.to !== VesselRoles.mixing"
				class="flex items-center justify-between gap-4">
				<div class="min-w-0">
					<Label :for="id('over-ice')">
						{{ $t('organisms.preparationBuilder.fields.overIce') }}
					</Label>
					<Text :id="id('over-ice-help')" class="text-body-sm text-content-muted">
						{{ $t('organisms.preparationBuilder.fields.overIceHelp') }}
					</Text>
				</div>
				<InputSwitch
					:id="id('over-ice')"
					:checked="!!strain.overIce"
					class="shrink-0"
					:aria-describedby="id('over-ice-help')"
					@update:checked="(value) => patch({ overIce: value })" />
			</div>
		</template>
		<!-- top -->
		<RecipeItemsField
			v-else-if="top"
			:id="id('item')"
			:label="$t('organisms.preparationBuilder.fields.topItem')"
			:model-value="hasItem(top.item) ? [top.item] : []"
			:choices="props.choices.ingredients"
			:error="props.errorOf('item')"
			@update:model-value="
				(value) => patch({ item: value[0] ?? emptyItemRef(RecipeLists.ingredients) })
			" />
		<!-- garnish -->
		<template v-else-if="garnish">
			<RecipeItemsField
				:id="id('items')"
				:label="$t('organisms.preparationBuilder.fields.garnishItems')"
				multiple
				:model-value="garnish.items"
				:choices="props.choices.garnishes"
				:error="props.errorOf('items')"
				@update:model-value="(value) => patch({ items: value })" />
			<InputWrapper>
				<template #label>
					<Label :for="id('style')">
						{{ $t('organisms.preparationBuilder.fields.style') }}
					</Label>
				</template>
				<InputSelect
					:id="id('style')"
					:model-value="garnish.style ?? ''"
					:options="options('garnishStyle', garnishStyles)"
					:placeholder="$t('organisms.preparationBuilder.fields.styleDefault')"
					@update:model-value="(value) => patch({ style: value })" />
			</InputWrapper>
		</template>
		<!-- custom -->
		<template v-else-if="custom">
			<div class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
				<InputWrapper v-for="lang in languages" :key="lang">
					<template #label>
						<Label :for="id(`text-${lang}`)">
							{{ $t('organisms.preparationBuilder.fields.text') }} ·
							{{ $t(`languages.${lang}`) }}
						</Label>
					</template>
					<InputTextArea
						:id="id(`text-${lang}`)"
						:model-value="custom.text[lang]"
						:rows="3"
						:has-error="!!props.errorOf('text') && !custom.text[lang].trim()"
						@update:model-value="(value) => handleCustomText(lang, value)" />
				</InputWrapper>
			</div>
			<ErrorMessage :value="props.errorOf('text')" />
			<RecipeItemsField
				:id="id('items')"
				:label="$t('organisms.preparationBuilder.fields.customItems')"
				multiple
				:model-value="custom.items ?? []"
				:choices="customChoices"
				@update:model-value="
					(value) => patch({ items: value.length ? value : undefined })
				" />
			<RoleField
				v-if="custom.items?.length"
				:id="id('into')"
				:model-value="custom.into ?? VesselRoles.serving"
				:label="$t('organisms.preparationBuilder.fields.customInto')"
				@update:model-value="(value) => patch({ into: value })" />
		</template>
	</div>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import {
	GlassPreparationModes,
	PreparationActionTypes,
	RecipeLists,
	VesselRoles,
	garnishStyles,
	glassPreparationModes,
	iceKinds,
	intensities,
	rimCoverages,
	strainKinds,
	vesselRoles
} from '~/domain/preparation/preparation.constants';
import type {
	PreparationAction,
	PreparationActionType,
	RecipeItemRef,
	RecipeList
} from '~/domain/preparation/preparation.entity';
import { languages } from '~/domain/shared/translations.constants';
import type { Language } from '~/domain/shared/translations.types';
import { emptyItemRef, hasItem, type RecipeItemChoice } from '~/helpers/recipe.helpers';
import RecipeItemsField from './RecipeItemsField.vue';
import RoleField from './RoleField.vue';

const props = defineProps({
	action: { type: Object as PropType<PreparationAction>, required: true },
	/** The recipe lines each list offers. */
	choices: {
		type: Object as PropType<Record<RecipeList, RecipeItemChoice[]>>,
		required: true
	},
	idPrefix: { type: String, required: true },
	/** The error of one field of this action, already translated; empty when there is none. */
	errorOf: { type: Function as PropType<(field: string) => string>, default: () => '' }
});
const emit = defineEmits<{
	(e: 'update:action', value: PreparationAction): void;
}>();

const { t } = useI18n();

const id = (field: string) => `${props.idPrefix}-${field}`;

const ofType = <Type extends PreparationActionType>(type: Type) =>
	computed(() =>
		props.action.type === type
			? (props.action as Extract<PreparationAction, { type: Type }>)
			: undefined
	);
const glass = ofType(PreparationActionTypes.prepareGlass);
const add = ofType(PreparationActionTypes.add);
const addIce = ofType(PreparationActionTypes.addIce);
const muddle = ofType(PreparationActionTypes.muddle);
const shake = ofType(PreparationActionTypes.shake);
const stir = ofType(PreparationActionTypes.stir);
const strain = ofType(PreparationActionTypes.strain);
const top = ofType(PreparationActionTypes.top);
const garnish = ofType(PreparationActionTypes.garnish);
const custom = ofType(PreparationActionTypes.custom);

/**
 * Applies changes to the action. What a select emits is a string its options guarantee to be a valid value
 * of the field, so the result is still an action.
 */
const patch = (changes: Record<string, unknown>) =>
	emit('update:action', { ...props.action, ...changes } as PreparationAction);

const options = (group: string, values: readonly string[]): InputSelectOption[] =>
	values.map((value) => ({
		label: t(`organisms.preparationBuilder.options.${group}.${value}`),
		value
	}));

const positiveOrUndefined = (value: number) => (value > 0 ? value : undefined);

// --- prepare_glass ---
const glassItem = computed(() => {
	const current = glass.value;
	return current && 'item' in current ? current.item : undefined;
});
const glassCoverage = computed(() => {
	const current = glass.value;
	return current && 'coverage' in current && current.coverage ? current.coverage : 'full';
});
const isRinse = computed(() => glass.value?.mode === GlassPreparationModes.rinse);
const glassItemLabel = computed(() =>
	t(
		isRinse.value
			? 'organisms.preparationBuilder.fields.rinseItem'
			: 'organisms.preparationBuilder.fields.rimItem'
	)
);
// A glass is rinsed with a liquid; its rim is covered with a garnish (salt, sugar) or an ingredient.
const glassChoices = computed(() =>
	isRinse.value
		? props.choices.ingredients
		: [...props.choices.garnishes, ...props.choices.ingredients]
);
const handleGlassMode = (mode: string) => {
	const current = glassItem.value;
	if (mode === GlassPreparationModes.chill || mode === GlassPreparationModes.warm) {
		emit('update:action', { type: PreparationActionTypes.prepareGlass, mode });
	} else if (mode === GlassPreparationModes.rinse) {
		emit('update:action', {
			type: PreparationActionTypes.prepareGlass,
			mode,
			item: current ?? emptyItemRef(RecipeLists.ingredients)
		});
	} else if (mode === GlassPreparationModes.rim) {
		emit('update:action', {
			type: PreparationActionTypes.prepareGlass,
			mode,
			item: current ?? emptyItemRef(RecipeLists.garnishes)
		});
	}
};
const handleGlassItem = (items: RecipeItemRef[]) =>
	patch({
		item:
			items[0] ??
			emptyItemRef(isRinse.value ? RecipeLists.ingredients : RecipeLists.garnishes)
	});

// --- strain ---
// Straining into the serving glass is the default, so the field is only sent for the reverse dry shake.
const handleStrainTo = (to: string) =>
	patch({ to: to === VesselRoles.mixing ? to : undefined, overIce: undefined });

// --- custom ---
const customChoices = computed<RecipeItemChoice[]>(() => [
	...props.choices.ingredients,
	...props.choices.garnishes
]);
const handleCustomText = (lang: Language, value: string) => {
	if (custom.value) patch({ text: { ...custom.value.text, [lang]: value } });
};
</script>
