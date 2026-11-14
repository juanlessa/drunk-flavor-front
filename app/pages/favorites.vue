<template>
	<NuxtLayout>
		<FavoritesOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
import { getLocaleAgnosticPageKey, shouldScrollToTop } from '~/helpers/route.helpers';
definePageMeta({
	middleware: 'guest',
	// Switching the language keeps the page mounted, so the loaded favorites and the scroll position stay.
	key: (route) => getLocaleAgnosticPageKey(route),
	scrollToTop: shouldScrollToTop
});
const { t } = useI18n();
useSeoMeta({
	title: () => t('seo.favorites.title'),
	description: () => t('seo.favorites.description'),
	ogTitle: () => t('seo.favorites.title'),
	ogDescription: () => t('seo.favorites.description'),
	ogType: 'website'
});
</script>
