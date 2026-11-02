<template>
	<!-- Mirrors DrinkDetail with a cover: back link, hero, then the ingredients and method cards. -->
	<div
		class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-3 pb-6 tablet:px-6"
		role="status"
		:aria-label="$t('drinkDetailPage.loading')">
		<div class="flex flex-col gap-3" aria-hidden="true">
			<div class="h-lh flex items-center text-body-sm">
				<AnimatedPlaceHolder class="h-[1em] w-28 rounded-xs" />
			</div>
			<AnimatedPlaceHolder class="w-full h-64 tablet:h-72 rounded-media" />
		</div>
		<div
			class="grid grid-cols-1 items-start gap-6 tablet:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
			aria-hidden="true">
			<Card>
				<div class="flex flex-col gap-4 p-5 tablet:p-6">
					<div class="h-lh flex items-center text-title-sm">
						<AnimatedPlaceHolder class="h-[1em] w-32 rounded-xs" />
					</div>
					<div class="flex flex-col gap-3 text-body">
						<div v-for="index in 4" :key="index" class="h-lh flex items-center">
							<AnimatedPlaceHolder class="h-[1em] w-4/5 rounded-xs" />
						</div>
					</div>
				</div>
			</Card>
			<Card>
				<div class="flex flex-col gap-4 p-5 tablet:p-6">
					<div class="h-lh flex items-center text-title-sm">
						<AnimatedPlaceHolder class="h-[1em] w-40 rounded-xs" />
					</div>
					<div class="flex flex-col text-body-lg">
						<div v-for="index in 3" :key="index" class="h-lh flex items-center">
							<AnimatedPlaceHolder class="h-[1em] w-full rounded-xs" />
						</div>
						<div class="h-lh flex items-center">
							<AnimatedPlaceHolder class="h-[1em] w-2/3 rounded-xs" />
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>
<script setup lang="ts"></script>
