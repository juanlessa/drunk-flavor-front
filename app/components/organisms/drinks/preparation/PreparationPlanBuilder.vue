<template>
	<div class="flex flex-col gap-6">
		<div class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
			<InputWrapper>
				<template #label>
					<Label for="mixing-vessel">
						{{ $t('organisms.preparationBuilder.mixingVessel.label') }}
					</Label>
				</template>
				<InputSelect
					id="mixing-vessel"
					:model-value="props.plan.mixingVessel"
					:options="vesselOptions"
					:has-error="!!props.checkError('preparation.mixingVessel')"
					@update:model-value="
						(value) => update({ mixingVessel: value as MixingVessel })
					" />
				<Text class="text-body-sm text-content-muted">
					{{ $t('organisms.preparationBuilder.mixingVessel.help') }}
				</Text>
			</InputWrapper>
			<InputWrapper>
				<template #label>
					<Label for="serving-glass">
						{{ $t('organisms.preparationBuilder.servingGlass.label') }}
					</Label>
				</template>
				<InputSelect
					id="serving-glass"
					:model-value="props.plan.servingGlass"
					:options="glassOptions"
					:has-error="!!props.checkError('preparation.servingGlass')"
					@update:model-value="
						(value) => update({ servingGlass: value as ServingGlass })
					" />
			</InputWrapper>
		</div>
		<div class="flex flex-col gap-3">
			<p class="font-medium text-content">
				{{ $t('organisms.preparationBuilder.actions.label') }}
			</p>
			<ol v-if="props.plan.actions.length" class="flex flex-col gap-2">
				<PreparationActionCard
					v-for="(action, index) in props.plan.actions"
					:key="index"
					:action="action"
					:index="index"
					:total="props.plan.actions.length"
					:open="opened[index] ?? false"
					:id-prefix="`action-${index}`"
					:choices="choices"
					:error-of="(field) => props.checkError(`preparation.actions.${index}.${field}`)"
					:errors="issuesOf(props.preview.errors, index)"
					:warnings="issuesOf(props.preview.warnings, index)"
					@update:action="(value) => updateAction(index, value)"
					@toggle="toggle(index)"
					@move-up="move(index, index - 1)"
					@move-down="move(index, index + 1)"
					@remove="remove(index)" />
			</ol>
			<p
				v-else
				class="rounded-md border border-dashed border-stroke-input px-4 py-6 text-center text-body-sm text-content-muted">
				{{ $t('organisms.preparationBuilder.actions.empty') }}
			</p>
			<ErrorMessage :value="props.checkError('preparation.actions')" />
			<InputWrapper>
				<template #label>
					<Label for="add-action">
						{{ $t('organisms.preparationBuilder.actions.addLabel') }}
					</Label>
				</template>
				<InputSelect
					id="add-action"
					:key="addKey"
					model-value=""
					:options="actionTypeOptions"
					:placeholder="$t('organisms.preparationBuilder.actions.addPlaceholder')"
					@update:model-value="handleAdd" />
			</InputWrapper>
		</div>
		<!-- Problems of the plan as a whole (nothing was served, a required ingredient was never used...). -->
		<ul v-if="planIssues.length" class="flex flex-col gap-1 text-body-sm">
			<li v-for="issue in planIssues" :key="issue.localeKey" role="alert" class="text-danger">
				{{ issue.message }}
			</li>
		</ul>
		<PreparationPreview :preview="props.preview" @generate="emit('generate')" />
	</div>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import {
	PreparationActionTypes,
	RecipeLists,
	VesselRoles,
	IceKinds,
	StrainKinds,
	GlassPreparationModes,
	mixingVessels,
	preparationActionTypes,
	servingGlasses
} from '~/domain/preparation/preparation.constants';
import type {
	MixingVessel,
	PreparationAction,
	PreparationActionType,
	PreparationPlan,
	RecipeList,
	ServingGlass
} from '~/domain/preparation/preparation.entity';
import type { ApiFieldError } from '~/domain/shared/api.types';
import { moveItem } from '~/helpers/array';
import { buildItemChoices, emptyItemRef, type RecipeItemChoice } from '~/helpers/recipe.helpers';
import type { DrinkRecipeLineForm, PreparationPreviewState } from '~/types/drink.types';
import PreparationActionCard from './PreparationActionCard.vue';
import PreparationPreview from './PreparationPreview.vue';

const props = defineProps({
	plan: { type: Object as PropType<PreparationPlan>, required: true },
	/** The recipe lines the actions can point at. */
	ingredients: { type: Array as PropType<DrinkRecipeLineForm[]>, default: () => [] },
	garnishes: { type: Array as PropType<DrinkRecipeLineForm[]>, default: () => [] },
	/** The error of a field of the form, already translated (`preparation.actions.2.items`). */
	checkError: { type: Function as PropType<(field: string) => string>, default: () => '' },
	preview: { type: Object as PropType<PreparationPreviewState>, required: true }
});
const emit = defineEmits<{
	(e: 'update:plan', value: PreparationPlan): void;
	(e: 'generate'): void;
}>();

const { t, locale } = useI18n();

const update = (changes: Partial<PreparationPlan>) =>
	emit('update:plan', { ...props.plan, ...changes });

const options = (group: string, values: readonly string[]): InputSelectOption[] =>
	values.map((value) => ({
		label: t(`organisms.preparationBuilder.options.${group}.${value}`),
		value
	}));
const vesselOptions = computed(() => options('mixingVessel', mixingVessels));
const glassOptions = computed(() => options('servingGlass', servingGlasses));
const actionTypeOptions = computed<InputSelectOption[]>(() =>
	preparationActionTypes.map((type) => ({
		label: t(`organisms.preparationBuilder.actionTypes.${type}.title`),
		value: type
	}))
);

// The lines the actions can point at, by list.
const choices = computed<Record<RecipeList, RecipeItemChoice[]>>(() => ({
	[RecipeLists.ingredients]: buildItemChoices(
		{ ingredients: props.ingredients },
		[RecipeLists.ingredients],
		locale.value
	),
	[RecipeLists.garnishes]: buildItemChoices(
		{ garnishes: props.garnishes },
		[RecipeLists.garnishes],
		locale.value
	)
}));

// --- which cards are open: one flag per action, kept in step with the list ---
const opened = ref<boolean[]>([]);
/** One flag per action: the ones that were never opened or closed count as closed. */
const openFlags = () =>
	Array.from({ length: props.plan.actions.length }, (_, index) => opened.value[index] ?? false);
const toggle = (index: number) => {
	opened.value[index] = !(opened.value[index] ?? false);
};

// --- actions ---
const addKey = ref(0);

/** The starting point of each kind of action: the fields it cannot be written without are empty. */
const buildAction = (type: PreparationActionType): PreparationAction => {
	switch (type) {
		case PreparationActionTypes.prepareGlass:
			return { type, mode: GlassPreparationModes.chill };
		case PreparationActionTypes.add:
			return { type, target: VesselRoles.mixing, items: [] };
		case PreparationActionTypes.addIce:
			return { type, target: VesselRoles.mixing, kind: IceKinds.cubes };
		case PreparationActionTypes.strain:
			return { type, kind: StrainKinds.single };
		case PreparationActionTypes.top:
			return { type, item: emptyItemRef(RecipeLists.ingredients) };
		case PreparationActionTypes.garnish:
			return { type, items: [] };
		case PreparationActionTypes.custom:
			return { type, text: { en: '', pt: '' } };
		case PreparationActionTypes.muddle:
		case PreparationActionTypes.shake:
		case PreparationActionTypes.stir:
			return { type };
	}
};

const isActionType = (value: string): value is PreparationActionType =>
	(preparationActionTypes as readonly string[]).includes(value);

const handleAdd = (type: string) => {
	if (!isActionType(type)) return;
	update({ actions: [...props.plan.actions, buildAction(type)] });
	// A new step opens, since it needs filling in.
	opened.value = [...openFlags(), true];
	// The select shows what was picked; a new key puts it back on its placeholder for the next action.
	addKey.value += 1;
};
const updateAction = (index: number, action: PreparationAction) =>
	update({
		actions: props.plan.actions.map((current, position) =>
			position === index ? action : current
		)
	});
const move = (from: number, to: number) => {
	if (to < 0 || to >= props.plan.actions.length) return;
	update({ actions: moveItem(props.plan.actions, from, to) });
	opened.value = moveItem(openFlags(), from, to);
};
const remove = (index: number) => {
	update({ actions: props.plan.actions.filter((_, position) => position !== index) });
	opened.value = opened.value.filter((_, position) => position !== index);
};

// --- what the API said ---
const actionPath = (index: number) => `preparation.actions.${index}`;
const issuesOf = (issues: ApiFieldError[], index: number) =>
	issues.filter(({ path }) => path === actionPath(index));
const planIssues = computed(() =>
	props.preview.errors.filter(({ path }) => path === 'preparation')
);

// An action with a problem opens, so the problem is not hidden in a closed card.
watch(
	() => [props.preview.errors, props.preview.warnings] as const,
	([errors, warnings]) => {
		const next = Array.from(
			{ length: props.plan.actions.length },
			(_, i) => opened.value[i] ?? false
		);
		[...errors, ...warnings].forEach(({ path }) => {
			const match = /^preparation\.actions\.(\d+)$/.exec(path);
			if (match && Number(match[1]) < next.length) next[Number(match[1])] = true;
		});
		opened.value = next;
	}
);
</script>
