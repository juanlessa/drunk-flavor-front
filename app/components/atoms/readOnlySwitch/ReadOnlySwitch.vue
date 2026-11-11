<template>
	<span
		:data-state="props.checked ? 'checked' : 'unchecked'"
		:class="readOnlySwitchStyle({ checked: props.checked })">
		<!--
			Takes the place of an InputSwitch in a read-only view, at its exact size (w-14 h-8), but reads as a
			value, not a control: a flat status pill with no thumb, an icon and the word, so the state does
			not depend on color. Same colors as the success and neutral badges.
		-->
		<!-- The icons carry their own size and fill; the wrapper overrides them. -->
		<span class="inline-flex size-3 shrink-0 *:size-full *:fill-current" aria-hidden="true">
			<CheckIcon v-if="props.checked" />
			<CloseIcon v-else />
		</span>
		{{ props.checked ? $t('molecules.readOnlyField.yes') : $t('molecules.readOnlyField.no') }}
	</span>
</template>
<script setup lang="ts">
import CheckIcon from '~/components/icons/CheckIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';
import { tv } from '~/utils/tv';

const props = defineProps({
	checked: { type: Boolean, default: false }
});

const readOnlySwitchStyle = tv({
	base: 'inline-flex h-8 w-14 shrink-0 items-center justify-center gap-1 rounded-full border text-caption font-bold whitespace-nowrap select-none',
	variants: {
		checked: {
			true: 'border-success/40 bg-success-surface text-success',
			// The border tints with the text, like the checked pill, so both outlines read the same size.
			false: 'border-content-muted/40 bg-surface-control text-content-muted'
		}
	}
});
</script>
