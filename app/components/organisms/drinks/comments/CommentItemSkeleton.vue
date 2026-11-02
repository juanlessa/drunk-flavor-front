<template>
	<!-- Mirrors CommentItem: 40px avatar, name and date lines, then two lines of content. -->
	<div class="flex gap-3 py-4" aria-hidden="true">
		<AnimatedPlaceHolder class="mt-0.5 size-10 shrink-0 rounded-full" />
		<div class="flex-1 min-w-0 flex flex-col gap-1.5">
			<div>
				<div class="h-lh flex items-center text-body-sm">
					<AnimatedPlaceHolder class="h-[1em] w-32 rounded-xs" />
				</div>
				<div class="h-lh flex items-center text-caption">
					<AnimatedPlaceHolder class="h-[1em] w-20 rounded-xs" />
				</div>
			</div>
			<div class="flex flex-col text-body">
				<div class="h-lh flex items-center">
					<AnimatedPlaceHolder class="h-[1em] w-full rounded-xs" />
				</div>
				<div class="h-lh flex items-center">
					<AnimatedPlaceHolder class="h-[1em] w-3/5 rounded-xs" />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts"></script>
