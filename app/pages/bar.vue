<template>
	<NuxtLayout>
		<MyBar />
	</NuxtLayout>
</template>
<script setup lang="ts">
import { getLocaleAgnosticPageKey } from '~/helpers/route.helpers';

definePageMeta({
	middleware: 'guest',
	// Switching the language keeps the bar mounted, with its ingredients and the drinks already loaded.
	key: (route) => getLocaleAgnosticPageKey(route)
});

const { t } = useI18n();

useSeoMeta({
	title: () => t('seo.myBar.title'),
	description: () => t('seo.myBar.description'),
	ogTitle: () => t('seo.myBar.title'),
	ogDescription: () => t('seo.myBar.description'),
	ogType: 'website'
});
</script>
