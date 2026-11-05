<template>
	<!-- Mirrors DrinkCard: same card box, square thumbnail and text column; each line keeps its text's line box. -->
	<Card
		class="w-full h-full tablet:max-w-drink-card-tablet desktop:max-w-drink-card-desktop p-2 flex gap-4"
		aria-hidden="true">
		<AnimatedPlaceHolder class="h-full w-auto aspect-square shrink-0 rounded-control" />
		<div class="flex-1 min-w-0 flex flex-col overflow-hidden">
			<div class="h-lh flex items-center justify-center text-title">
				<AnimatedPlaceHolder class="h-[1em] w-3/5 rounded-xs" />
			</div>
			<div class="mt-2 min-w-0">
				<div class="h-lh flex items-center text-caption-sm">
					<AnimatedPlaceHolder class="h-[1em] w-16 rounded-xs" />
				</div>
				<div class="mt-1 h-lh flex items-center text-body-sm leading-short">
					<AnimatedPlaceHolder class="h-[1em] w-4/5 rounded-xs" />
				</div>
			</div>
			<div class="mt-auto pt-1 min-w-0 flex items-center justify-between gap-2">
				<div class="h-lh flex items-center text-caption">
					<AnimatedPlaceHolder class="h-[1em] w-20 rounded-xs" />
				</div>
				<div class="shrink-0 h-lh flex items-center gap-1 text-caption">
					<AnimatedPlaceHolder class="size-4 rounded-skeleton-block" />
					<AnimatedPlaceHolder class="h-[1em] w-8 rounded-xs" />
				</div>
			</div>
		</div>
	</Card>
</template>
<script setup lang="ts"></script>
