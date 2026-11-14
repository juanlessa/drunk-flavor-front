<template>
	<section
		class="flex flex-col items-center gap-3 rounded-card border border-stroke bg-surface px-6 py-10 text-center shadow-card"
		:aria-labelledby="titleId"
		data-testid="favorites-signed-out">
		<span
			class="grid size-16 place-items-center rounded-full bg-favorite-subtle text-favorite"
			aria-hidden="true">
			<HeartIcon filled class="size-8" />
		</span>
		<h2 :id="titleId" class="text-title-sm font-bold text-content">
			{{ $t('organisms.favorites.signedOut.title') }}
		</h2>
		<p class="max-w-sm text-body text-content-secondary">
			{{ $t('organisms.favorites.signedOut.description') }}
		</p>
		<div class="mt-2 flex w-full flex-col items-center gap-3">
			<Button variant="primary" @click="handleSignIn">
				{{ $t('organisms.favorites.signedOut.signIn') }}
			</Button>
			<Anchor :to="localePath('/')" class="text-body-sm underline underline-offset-4">
				{{ $t('organisms.favorites.signedOut.browse') }}
			</Anchor>
		</div>
	</section>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import HeartIcon from '~/components/icons/HeartIcon.vue';
const titleId = useId();
const route = useRoute();
const localePath = useLocalePath();
// Signing in brings the person back to this page.
const handleSignIn = () =>
	navigateTo({ path: localePath('/signin').toString(), query: { redirect: route.fullPath } });
</script>
