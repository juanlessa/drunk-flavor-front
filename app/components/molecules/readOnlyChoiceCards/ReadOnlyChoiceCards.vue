<template>
	<ul :aria-label="props.label" class="grid list-none grid-cols-1 gap-3 tablet:grid-cols-2">
		<!--
			Takes the place of a RadioCardGroup in a read-only view, with the same grid and card size, but
			reads as a result, not a choice to make: no radio circle, no pointer or hover, a check on the
			chosen card and an x on the others, which are flat with a dashed border. Same colors as the
			read-only switch.
		-->
		<li
			v-for="option in props.options"
			:key="option.value"
			:data-state="isSelected(option) ? 'checked' : 'unchecked'"
			:class="cardStyle({ selected: isSelected(option) })">
			<!-- The icons carry their own size and fill; the wrapper overrides them. -->
			<span :class="iconStyle({ selected: isSelected(option) })" aria-hidden="true">
				<CheckIcon v-if="isSelected(option)" />
				<CloseIcon v-else />
			</span>
			<span class="flex min-w-0 flex-col gap-0.5">
				<span :class="labelStyle({ selected: isSelected(option) })">
					{{ option.label }}
					<span v-if="isSelected(option)" class="sr-only">
						({{ $t('molecules.readOnlyChoiceCards.selected') }})
					</span>
				</span>
				<span v-if="option.description" class="text-body-sm text-content-muted">
					{{ option.description }}
				</span>
			</span>
		</li>
	</ul>
</template>
<script setup lang="ts">
import CheckIcon from '~/components/icons/CheckIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';
import type { RadioCardOption } from '~/components/molecules/radioCardGroup/RadioCardGroup.types';
import { tv } from '~/utils/tv';

const props = defineProps({
	/** The value of the chosen option. */
	modelValue: { type: String, default: '' },
	options: { type: Array as PropType<RadioCardOption[]>, required: true },
	/** Names the list for assistive technology, like the label of the group in the form. */
	label: { type: String, required: true }
});

const isSelected = (option: RadioCardOption) => option.value === props.modelValue;

// Same box as a RadioCardGroup card (min height, padding, gap, radius and border width).
const cardStyle = tv({
	base: 'flex min-h-11 items-start gap-3 rounded-control border p-3',
	variants: {
		selected: {
			true: 'border-success/40 bg-surface',
			false: 'border-dashed border-stroke bg-transparent'
		}
	}
});
// The same 20px slot as the radio circle.
const iconStyle = tv({
	base: 'mt-0.5 flex size-5 shrink-0 items-center justify-center *:size-3.5 *:fill-current',
	variants: {
		selected: { true: 'text-success', false: 'text-content-muted' }
	}
});
const labelStyle = tv({
	base: 'text-body font-medium',
	variants: {
		selected: { true: 'text-content', false: 'text-content-muted' }
	}
});
</script>
