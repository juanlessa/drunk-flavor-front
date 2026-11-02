<template>
	<div class="w-screen min-h-dvh flex flex-col bg-surface tablet:bg-surface-sunken">
		<!--
			Shared shell of every auth page: back, language and theme on top; the logo and the page
			content in a centered panel (a card from tablet up, the plain screen on mobile); an
			optional footer slot below it (e.g. the legal notice of sign-in and sign-up).
		-->
		<!-- Same content width as the top bar (1190px), so the controls line up with the app. -->
		<header
			class="mx-auto w-full max-w-screen-desktop h-14 tablet:h-16 shrink-0 px-2 tablet:px-6 flex items-center justify-between gap-4">
			<button
				type="button"
				class="h-11 min-w-11 px-3 inline-flex items-center justify-center gap-2 rounded-full text-body-sm font-medium text-content-secondary cursor-pointer hover:bg-surface-hover hover:text-content focus-visible:outline-hidden focus-visible:shadow-focus-ring"
				:aria-label="$t('layouts.auth.backButton.value')"
				@click="handleBack">
				<ArrowLeftIcon class="size-4 fill-current!" aria-hidden="true" />
				<span class="hidden tablet:inline" aria-hidden="true">
					{{ $t('layouts.auth.backButton.value') }}
				</span>
			</button>
			<div class="flex items-center gap-2">
				<LanguageSwitcher />
				<ThemeSwitcher />
			</div>
		</header>

		<main class="flex-1 flex justify-center px-4 pt-4 pb-8 tablet:items-center tablet:px-6">
			<div
				class="w-full max-w-auth-panel flex flex-col gap-8 tablet:p-10 tablet:rounded-auth-panel tablet:border tablet:border-stroke tablet:bg-surface tablet:shadow-card">
				<NuxtLink
					:to="localePath('/')"
					class="self-start rounded-option focus-visible:outline-hidden focus-visible:shadow-focus-ring">
					<!-- Width/height attributes reserve the box before the SVG loads (443×90 viewBox). -->
					<img
						src="/logos/logo-outfit-light.svg"
						alt="DrunkFlavor"
						width="443"
						height="90"
						class="block h-8 w-auto dark:hidden" />
					<img
						src="/logos/logo-outfit-dark.svg"
						alt="DrunkFlavor"
						width="443"
						height="90"
						class="hidden h-8 w-auto dark:block" />
				</NuxtLink>
				<slot></slot>
			</div>
		</main>

		<footer v-if="$slots.footer" class="shrink-0 px-4 pb-6 text-center">
			<slot name="footer"></slot>
		</footer>
	</div>
</template>
<script setup lang="ts">
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';

const { $router } = useNuxtApp();
const localePath = useLocalePath();

// Go to the previous page. When the auth page was opened directly (new tab, shared link)
// there is no in-app history entry to return to, so fall back to the home page.
const handleBack = () => {
	if (window.history.state?.back) {
		$router.back();
		return;
	}
	$router.push(localePath('/'));
};
</script>
