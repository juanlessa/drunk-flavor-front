<template>
	<!-- Mirrors UserCard: avatar, text block, badges and arrow; each line keeps its text's line box. -->
	<div
		class="w-full flex items-center gap-4 p-4 bg-surface border border-stroke shadow-card rounded-card"
		aria-hidden="true">
		<AnimatedPlaceHolder class="size-10 shrink-0 rounded-full" />
		<div
			class="min-w-0 flex-1 flex flex-col gap-2 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4">
			<div class="min-w-0">
				<div class="h-lh flex items-center text-body">
					<AnimatedPlaceHolder class="h-[1em] w-36 rounded-xs" />
				</div>
				<div class="h-lh flex items-center text-body-sm">
					<AnimatedPlaceHolder class="h-[1em] w-52 rounded-xs" />
				</div>
			</div>
			<div class="flex gap-2 tablet:shrink-0">
				<!-- h-auto + the badge's padding and font: the nbsp inside gives the exact badge height. -->
				<AnimatedPlaceHolder class="h-auto w-14 py-0.5 text-caption rounded-full" />
				<AnimatedPlaceHolder class="h-auto w-16 py-0.5 text-caption rounded-full" />
			</div>
		</div>
		<AnimatedPlaceHolder class="size-4 shrink-0 rounded-skeleton-block" />
	</div>
</template>
<script setup lang="ts"></script>
