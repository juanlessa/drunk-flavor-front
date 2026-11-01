<template>
	<!-- Mirrors UserAdministrationSummary: identity row with badges, then the three-field grid. -->
	<Card class="flex flex-col gap-6 p-5 tablet:p-6" aria-hidden="true">
		<div class="flex items-center gap-4">
			<AnimatedPlaceHolder class="size-16 shrink-0 rounded-full" />
			<div class="min-w-0 flex-1">
				<div class="h-lh flex items-center text-title-sm">
					<AnimatedPlaceHolder class="h-[1em] w-48 rounded-xs" />
				</div>
				<div class="h-lh flex items-center text-body-sm">
					<AnimatedPlaceHolder class="h-[1em] w-56 rounded-xs" />
				</div>
				<div class="mt-2 flex gap-2">
					<!-- h-auto + the badge's padding and font: the nbsp inside gives the exact badge height. -->
					<AnimatedPlaceHolder class="h-auto w-14 py-0.5 text-caption rounded-full" />
					<AnimatedPlaceHolder class="h-auto w-16 py-0.5 text-caption rounded-full" />
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 border-t border-stroke pt-4 tablet:grid-cols-3">
			<div v-for="field in FIELDS" :key="field">
				<div class="h-lh flex items-center text-body-sm">
					<AnimatedPlaceHolder class="h-[1em] w-20 rounded-xs" />
				</div>
				<div class="h-lh flex items-center text-body">
					<AnimatedPlaceHolder class="h-[1em] w-24 rounded-xs" />
				</div>
			</div>
		</div>
	</Card>
</template>
<script setup lang="ts">
// Role, status and email verification.
const FIELDS = ['role', 'status', 'emailVerified'] as const;
</script>
