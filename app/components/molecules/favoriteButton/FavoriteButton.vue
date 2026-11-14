<template>
	<!--
		A toggle button (WAI-ARIA): `aria-pressed` carries the state and the name never changes with it. A second tap
		while the request is on its way is ignored; the button stays focusable, so `aria-disabled` and not `disabled`.
	-->
	<button
		type="button"
		:class="buttonStyles({ variant: props.variant })"
		:aria-pressed="pressed"
		:aria-label="$t('molecules.favoriteButton.ariaLabel', { name: props.drinkName })"
		:aria-disabled="pending"
		@click="handleClick">
		<HeartIcon :filled="pressed" :class="iconStyles({ variant: props.variant })" />
		<span v-if="props.variant === 'pill'" class="hidden tablet:inline">
			{{ $t('molecules.favoriteButton.label') }}
		</span>
	</button>
</template>
<script setup lang="ts">
import HeartIcon from '~/components/icons/HeartIcon.vue';
import { tv } from '~/utils/tv';
type FavoriteButtonVariant = 'chip' | 'media' | 'pill';
const props = defineProps({
	drinkId: { type: String, required: true },
	/** Only for the accessible name: the button says which drink it saves. */
	drinkName: { type: String, required: true },
	/**
	 * - `chip`: a glass chip over a thumbnail (the drink card). Position it with `top-*` and `right-*`.
	 * - `media`: a dark chip over a cover photo. Position it the same way.
	 * - `pill`: in the flow, with its label from tablet up (the header of a drink without a cover).
	 */
	variant: { type: String as PropType<FavoriteButtonVariant>, default: 'chip' }
});
const { isFavorite, isPending, toggle } = useFavorites();
const pressed = computed(() => isFavorite(props.drinkId));
const pending = computed(() => isPending(props.drinkId));
const handleClick = () => {
	if (pending.value) return;
	void toggle(props.drinkId);
};
// The chip and the media variants are `absolute`, and their `before` grows the hit area to 44px without
// changing the layout, so the 32px chip over a stretched card link (WCAG 2.5.8) is still easy to hit.
const buttonStyles = tv({
	base: 'inline-flex items-center justify-center rounded-full border cursor-pointer transition-colors duration-short before:absolute before:-inset-1.5 before:rounded-full before:content-[""] focus-visible:outline-hidden focus-visible:shadow-focus-ring aria-disabled:cursor-progress',
	variants: {
		variant: {
			chip: 'absolute z-10 size-8 border-stroke bg-surface/90 text-content-secondary shadow-sm backdrop-blur-sm hover:bg-surface-hover hover:text-favorite aria-pressed:border-favorite/45 aria-pressed:text-favorite',
			media: 'absolute z-10 size-11 border-white/30 bg-black/35 text-white backdrop-blur-sm hover:bg-black/50 aria-pressed:border-favorite-on-media/55 aria-pressed:text-favorite-on-media',
			pill: 'relative size-11 gap-2 border-stroke-input text-body-sm font-medium text-content-secondary hover:bg-surface-hover hover:text-content aria-pressed:border-favorite/50 aria-pressed:bg-favorite-subtle aria-pressed:text-favorite-content aria-pressed:hover:bg-favorite-subtle tablet:h-10 tablet:w-auto tablet:px-4'
		}
	}
});
const iconStyles = tv({
	base: 'shrink-0',
	variants: {
		variant: {
			chip: 'size-4.5',
			media: 'size-5.5',
			pill: 'size-5'
		}
	}
});
</script>
