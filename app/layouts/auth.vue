<template>
	<Box
		direction="row"
		class="w-screen min-h-screen items-center justify-center bg-surface tablet:bg-surface-sunken">
		<Box
			as="main"
			direction="col"
			class="flex-1 max-w-auth-panel gap-6 p-4 rounded-auth-panel bg-surface tablet:shadow-card">
			<Box as="header" direction="row" class="items-center justify-between gap-4">
				<Button variant="plain" class="inline-flex items-center gap-2" @click="handleBack">
					<ArrowLeftIcon />
					{{ $t('layouts.auth.backButton.value') }}
				</Button>
				<Box direction="row" class="items-center gap-4">
					<LanguageSwitcher />
					<ThemeSwitcher />
				</Box>
			</Box>
			<Box direction="row" class="h-auth-logo justify-center">
				<Anchor :to="localePath('/')">
					<Image src="/light-logo.png" alt="Drunk Flavor logo" />
				</Anchor>
			</Box>
			<slot></slot>
		</Box>
	</Box>
</template>

<script setup lang="ts">
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
