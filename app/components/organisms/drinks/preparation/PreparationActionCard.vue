<template>
	<li
		class="flex flex-col rounded-md border bg-surface"
		:class="props.errors.length || hasFieldError ? 'border-danger-stroke' : 'border-stroke'"
		:data-testid="`action-${props.index}`">
		<!-- The header is one button that opens the card; the moves sit beside it, never inside it. -->
		<div class="flex items-center gap-1 p-2">
			<button
				type="button"
				class="flex min-w-0 flex-1 items-center gap-3 rounded-control px-2 py-1.5 text-left cursor-pointer focus-visible:outline-hidden focus-visible:shadow-focus-ring"
				:aria-expanded="props.open"
				:aria-controls="bodyId"
				@click="emit('toggle')">
				<span
					class="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-control text-body-sm font-bold text-content-muted">
					{{ props.index + 1 }}
				</span>
				<span class="flex min-w-0 flex-1 flex-col">
					<span class="truncate font-medium text-content">{{ title }}</span>
					<span v-if="summary" class="truncate text-body-sm text-content-muted">
						{{ summary }}
					</span>
				</span>
				<Badge
					v-if="props.errors.length || hasFieldError"
					tone="danger"
					:value="$t('organisms.preparationBuilder.card.error')" />
				<Badge
					v-else-if="props.warnings.length"
					tone="warning"
					:value="$t('organisms.preparationBuilder.card.warning')" />
			</button>
			<button
				type="button"
				:class="iconButtonStyle()"
				:disabled="props.index === 0"
				:aria-label="$t('organisms.preparationBuilder.card.moveUp', { name: title })"
				@click="emit('moveUp')">
				<ArrowUpIcon class="fill-current" aria-hidden="true" />
			</button>
			<button
				type="button"
				:class="iconButtonStyle()"
				:disabled="props.index === props.total - 1"
				:aria-label="$t('organisms.preparationBuilder.card.moveDown', { name: title })"
				@click="emit('moveDown')">
				<ArrowDownIcon class="fill-current" aria-hidden="true" />
			</button>
			<button
				type="button"
				:class="iconButtonStyle({ tone: 'danger' })"
				:aria-label="$t('organisms.preparationBuilder.card.remove', { name: title })"
				@click="emit('remove')">
				<TrashIcon class="fill-current" aria-hidden="true" />
			</button>
		</div>
		<div
			v-show="props.open || hasFieldError"
			:id="bodyId"
			class="flex flex-col gap-4 border-t border-stroke p-4">
			<PreparationActionEditor
				:action="props.action"
				:choices="props.choices"
				:id-prefix="bodyId"
				:error-of="props.errorOf"
				@update:action="(value) => emit('update:action', value)" />
		</div>
		<!-- What the API said about this step is shown even when the card is closed. -->
		<ul
			v-if="props.errors.length || props.warnings.length"
			class="flex flex-col gap-1 border-t border-stroke px-4 py-3 text-body-sm">
			<li
				v-for="issue in props.errors"
				:key="`${issue.localeKey}-${issue.message}`"
				role="alert"
				class="text-danger">
				{{ issue.message }}
			</li>
			<li
				v-for="issue in props.warnings"
				:key="`${issue.localeKey}-${issue.message}`"
				class="text-warning">
				{{ issue.message }}
			</li>
		</ul>
	</li>
</template>
<script setup lang="ts">
import type { ApiFieldError } from '~/domain/shared/api.types';
import { PreparationActionTypes } from '~/domain/preparation/preparation.constants';
import type {
	PreparationAction,
	RecipeItemRef,
	RecipeList
} from '~/domain/preparation/preparation.entity';
import { getRecipeItemKey, type RecipeItemChoice } from '~/helpers/recipe.helpers';
import { tv } from '~/utils/tv';
import PreparationActionEditor from './PreparationActionEditor.vue';

const props = defineProps({
	action: { type: Object as PropType<PreparationAction>, required: true },
	index: { type: Number, required: true },
	total: { type: Number, required: true },
	open: { type: Boolean, default: false },
	idPrefix: { type: String, required: true },
	choices: {
		type: Object as PropType<Record<RecipeList, RecipeItemChoice[]>>,
		required: true
	},
	/** The error of one field of this action found by the form itself, already translated. */
	errorOf: { type: Function as PropType<(field: string) => string>, default: () => '' },
	/** What the API reported for this step (errors block the method, warnings do not). */
	errors: { type: Array as PropType<ApiFieldError[]>, default: () => [] },
	warnings: { type: Array as PropType<ApiFieldError[]>, default: () => [] }
});
const emit = defineEmits<{
	(e: 'update:action', value: PreparationAction): void;
	(e: 'toggle' | 'moveUp' | 'moveDown' | 'remove'): void;
}>();

const { t, locale } = useI18n();

const bodyId = computed(() => `${props.idPrefix}-body`);
const title = computed(() =>
	t(`organisms.preparationBuilder.actionTypes.${props.action.type}.title`)
);

const FIELDS = ['item', 'items', 'text', 'seconds', 'revolutions'];
const hasFieldError = computed(() => FIELDS.some((field) => !!props.errorOf(field)));

const choiceNames = computed(() => {
	const names = new Map<string, string>();
	Object.values(props.choices)
		.flat()
		.forEach((choice) => names.set(choice.key, choice.name));
	return names;
});
const namesOf = (items: RecipeItemRef[]) =>
	items
		.filter(({ ingredientId }) => ingredientId)
		.map((item) => choiceNames.value.get(getRecipeItemKey(item)) ?? '')
		.filter(Boolean)
		.join(', ');
const optionLabel = (group: string, value?: string) =>
	value ? t(`organisms.preparationBuilder.options.${group}.${value}`) : '';

/** One line that says what the step does, so a closed card is still readable. */
const summary = computed(() => {
	const action = props.action;
	switch (action.type) {
		case PreparationActionTypes.prepareGlass:
			return [
				optionLabel('glassMode', action.mode),
				'item' in action ? namesOf([action.item]) : ''
			]
				.filter(Boolean)
				.join(' · ');
		case PreparationActionTypes.add:
		case PreparationActionTypes.garnish:
			return namesOf(action.items);
		case PreparationActionTypes.top:
			return namesOf([action.item]);
		case PreparationActionTypes.addIce:
			return optionLabel('iceKind', action.kind);
		case PreparationActionTypes.strain:
			return optionLabel('strainKind', action.kind);
		case PreparationActionTypes.muddle:
		case PreparationActionTypes.shake:
		case PreparationActionTypes.stir:
			return optionLabel(`intensity.${action.type}`, action.intensity);
		case PreparationActionTypes.custom:
			return action.text[locale.value];
		default:
			return '';
	}
});

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
