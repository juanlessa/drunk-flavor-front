<template>
	<div
		class="mx-auto flex w-full max-w-screen-desktop flex-1 flex-col gap-6 px-4 pt-3 pb-6 tablet:px-6 tablet:pb-8">
		<!-- Same back link and spacing as the other pages that open from the home. -->
		<div class="flex flex-col gap-3">
			<Anchor
				:to="localePath('/')"
				class="self-start inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('organisms.favorites.backLink') }}
			</Anchor>
			<header class="flex flex-col gap-1">
				<h1 class="text-title-lg font-bold text-content tablet:text-headline-sm">
					{{ $t('organisms.favorites.title') }}
				</h1>
				<p class="max-w-2xl text-body text-content-secondary">
					{{
						isSessionKnown && !isAuthenticated
							? $t('organisms.favorites.descriptionSignedOut')
							: $t('organisms.favorites.description')
					}}
				</p>
			</header>
		</div>
		<!-- The server cannot know who is signed in, so it renders the skeleton and the browser takes over. -->
		<FavoritesGridSkeleton v-if="!isSessionKnown" />
		<FavoritesSignedOut v-else-if="!isAuthenticated" />
		<FavoritesList v-else />
	</div>
</template>
<script setup lang="ts">
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
const { $auth } = useNuxtApp();
const localePath = useLocalePath();
const isSessionKnown = useSessionKnown();
const isAuthenticated = computed(() => $auth.state.value.isAuthenticated);
</script>
