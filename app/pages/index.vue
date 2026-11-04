<template>
	<NuxtLayout>
		<DrinksOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
import { SITE_NAME } from '~/constants/site.constants';
import { getLocaleAgnosticPageKey } from '~/helpers/route.helpers';

definePageMeta({
	middleware: 'guest',
	// Switching the language keeps this page mounted, so the loaded drinks and the scroll position stay.
	key: (route) => getLocaleAgnosticPageKey(route)
});

const { t } = useI18n();

// The home leads with the brand ("DrunkFlavor | <tagline>"), so it skips the global
// "<title> | DrunkFlavor" template. Built here because "|" is the plural separator in messages.
const homeTitle = computed(() => `${SITE_NAME} | ${t('seo.home.tagline')}`);

useHead({ titleTemplate: '%s' });
useSeoMeta({
	title: () => homeTitle.value,
	description: () => t('seo.home.description'),
	ogTitle: () => homeTitle.value,
	ogDescription: () => t('seo.home.description'),
	ogType: 'website'
});
</script>
