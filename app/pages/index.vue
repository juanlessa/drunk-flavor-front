<template>
	<NuxtLayout>
		<DrinksOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
import { SITE_NAME } from '~/constants/site.constants';
import { getLocaleAgnosticPageKey, shouldScrollToTop } from '~/helpers/route.helpers';
import { buildSiteJsonLd, serializeJsonLd } from '~/helpers/structuredData.helpers';

definePageMeta({
	middleware: 'guest',
	// Switching the language keeps this page mounted, so the loaded drinks and the scroll position stay.
	key: (route) => getLocaleAgnosticPageKey(route),
	scrollToTop: shouldScrollToTop
});

const { t, locale } = useI18n();
const localePath = useLocalePath();
const siteUrl = useSiteConfig().url;

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

// Tells search engines the site name and the organization behind it.
useHead({
	script: computed(() => [
		{
			key: 'site-structured-data',
			type: 'application/ld+json',
			innerHTML: serializeJsonLd(
				buildSiteJsonLd({
					name: SITE_NAME,
					siteUrl,
					homeUrl: new URL(localePath('/').toString(), siteUrl).href,
					locale: locale.value
				})
			)
		}
	])
});
</script>
