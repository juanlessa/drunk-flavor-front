<template>
	<li class="flex flex-col gap-2 rounded-md border border-stroke bg-surface p-3">
		<!-- Two bands on mobile (identity, then controls); a single line from tablet up. -->
		<div class="flex flex-col gap-3 tablet:flex-row tablet:items-center">
			<div class="flex min-w-0 flex-1 items-center gap-3">
				<!-- touch-none lets a finger drag from the handle instead of scrolling the page. -->
				<button
					type="button"
					data-drag-handle
					:class="
						iconButtonStyle({
							size: 'handle',
							class: 'cursor-grab touch-none active:cursor-grabbing'
						})
					"
					:aria-label="$t('organisms.ingredientsSelection.dragHandle.label', { name })"
					:aria-describedby="props.instructionsId">
					<GripIcon class="fill-current" aria-hidden="true" />
				</button>
				<div class="min-w-0 flex-1">
					<p class="truncate font-medium text-content">
						{{ props.index + 1 }}. {{ name }}
					</p>
					<p class="truncate text-body-sm text-content-muted">
						{{ getIngredientSummary(props.ingredient, locale) }}
					</p>
				</div>
				<!-- Display classes go through tv so they replace the base inline-flex instead of racing it. -->
				<button
					type="button"
					:class="iconButtonStyle({ tone: 'danger', class: 'tablet:hidden' })"
					:aria-label="removeLabel"
					@click="emit('remove')">
					<TrashIcon class="fill-current" aria-hidden="true" />
				</button>
			</div>

			<div class="flex items-center gap-2 pl-11 tablet:pl-0">
				<div class="min-w-0 flex-1 tablet:w-36 tablet:flex-none">
					<Label :for="quantityId" class="sr-only">
						{{ $t('organisms.ingredientsSelection.quantity.label', { name }) }}
					</Label>
					<InputNumber
						:id="quantityId"
						:model-value="props.quantity"
						:suffix="suffix"
						:integer="!props.ingredient.unit.allowDecimal"
						:has-error="!!props.error"
						@update:model-value="(value: number) => emit('update:quantity', value)"
						@blur="emit('blur')" />
				</div>
				<button
					type="button"
					:class="iconButtonStyle({ size: 'move' })"
					:disabled="props.index === 0"
					:aria-label="$t('organisms.ingredientsSelection.moveUp.label', { name })"
					@click="emit('moveUp')">
					<ArrowUpIcon class="fill-current" aria-hidden="true" />
				</button>
				<button
					type="button"
					:class="iconButtonStyle({ size: 'move' })"
					:disabled="props.index === props.total - 1"
					:aria-label="$t('organisms.ingredientsSelection.moveDown.label', { name })"
					@click="emit('moveDown')">
					<ArrowDownIcon class="fill-current" aria-hidden="true" />
				</button>
				<button
					type="button"
					:class="iconButtonStyle({ tone: 'danger', class: 'hidden tablet:inline-flex' })"
					:aria-label="removeLabel"
					@click="emit('remove')">
					<TrashIcon class="fill-current" aria-hidden="true" />
				</button>
			</div>
		</div>

		<ErrorMessage v-if="props.error" class="pl-11" :value="props.error" />
	</li>
</template>
<script setup lang="ts">
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { getIngredientSummary } from '~/helpers/ingredient.helpers';
import { tv } from '~/utils/tv';

const props = defineProps({
	ingredient: { type: Object as PropType<Ingredient>, required: true },
	index: { type: Number, required: true },
	total: { type: Number, required: true },
	quantity: { type: Number, default: 0 },
	error: { type: String, default: '' },
	/** Id of the text explaining how to reorder, shared by every handle. */
	instructionsId: { type: String, default: undefined }
});

const emit = defineEmits<{
	(e: 'update:quantity', value: number): void;
	(e: 'moveUp' | 'moveDown' | 'remove' | 'blur'): void;
}>();

const { t, locale } = useI18n();

const name = computed(() => props.ingredient.translations[locale.value].name);
const quantityId = computed(() => `ingredient-quantity-${props.ingredient.id}`);
const removeLabel = computed(() =>
	t('organisms.ingredientsSelection.removeButton.label', { name: name.value })
);
// Same wording as the drink page: the symbol, or the singular/plural unit name.
const suffix = computed(() => {
	const { unit } = props.ingredient;
	if (unit.symbol) return unit.symbol;
	const { name: singular, namePlural } = unit.translations[locale.value];
	return props.quantity === 1 ? singular : namePlural;
});

const iconButtonStyle = tv({
	base: 'inline-flex shrink-0 items-center justify-center rounded-icon-action text-content-muted cursor-pointer transition-colors duration-short focus-visible:outline-hidden focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-disabled',
	variants: {
		size: {
			// 40px touch targets on mobile, compact from tablet up.
			move: 'size-10 bg-surface-control enabled:hover:bg-surface-control-hover tablet:size-8 tablet:bg-surface-transparent tablet:enabled:hover:bg-surface-hover',
			handle: 'size-8 hover:bg-surface-hover',
			default: 'size-8'
		},
		tone: {
			default: '',
			danger: 'hover:bg-danger-surface hover:text-danger'
		}
	},
	defaultVariants: { size: 'default', tone: 'default' }
});
</script>
