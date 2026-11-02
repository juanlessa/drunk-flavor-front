<template>
	<div
		:class="managementItemCardStyle({ skeleton: true })"
		:style="managementItemCardDimensions"
		aria-hidden="true">
		<div :class="managementItemCardContentStyle({ media: props.media })">
			<!-- Same box as the media slot of the card (e.g. the 44px drink thumbnail). -->
			<AnimatedPlaceHolder v-if="props.media" class="size-11 shrink-0 rounded-control" />
			<!-- Each line takes the line box of the text it stands for, so the bars sit where the text will. -->
			<div class="flex-1 min-w-0 flex flex-col">
				<div class="h-lh flex items-center text-body">
					<AnimatedPlaceHolder class="h-[1em] w-2/5 rounded-xs" />
				</div>
				<div class="h-lh flex items-center text-body-sm">
					<AnimatedPlaceHolder class="h-[1em] w-1/4 rounded-xs" />
				</div>
			</div>
		</div>
		<!-- Same footprint as the size-8 delete button around its size-4 icon. -->
		<div class="shrink-0 size-8 flex items-center justify-center">
			<AnimatedPlaceHolder class="size-4 rounded-skeleton-block" />
		</div>
	</div>
</template>
<script setup lang="ts">
import {
	managementItemCardContentStyle,
	managementItemCardDimensions,
	managementItemCardStyle
} from '~/components/molecules/managementItemCard/ManagementItemCard.styles';

const props = defineProps({
	/** Reserves the leading square used by cards that render the `media` slot. */
	media: {
		type: Boolean,
		default: false
	}
});
</script>
