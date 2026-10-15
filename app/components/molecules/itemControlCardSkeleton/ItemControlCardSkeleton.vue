<template>
	<div :class="itemControlCardStyle({ skeleton: true })" :style="itemControlCardDimensions">
		<div class="flex-1 py-0.5">
			<AnimatedPlaceHolder class="w-40 h-5 rounded-xs" />
		</div>
		<AnimatedPlaceHolder class="w-4 h-4 rounded-skeleton-block" />
	</div>
</template>
<script setup lang="ts">
import {
	itemControlCardDimensions,
	itemControlCardStyle
} from '~/components/molecules/itemControlCard/ItemControlCard.styles';
</script>
