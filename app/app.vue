<template>
	<div>
		<NuxtPage />
		<ToastNotification />
	</div>
</template>
<script setup lang="ts">
import { DEFAULT_SHARE_IMAGE, SITE_NAME } from '~/constants/site.constants';

// Language-aware head for every page: <html lang>, hreflang alternates, canonical and og:locale.
const localeHead = useLocaleHead();

useHead(() => ({
	htmlAttrs: { ...localeHead.value.htmlAttrs },
	link: [...(localeHead.value.link ?? [])],
	meta: [...(localeHead.value.meta ?? [])],
	titleTemplate: (title?: string) => (title ? `${title} | ${SITE_NAME}` : SITE_NAME)
}));

const { t } = useI18n();
const siteUrl = useSiteConfig().url;

// Default picture and card for every page; pages with a picture of their own (a drink) override it.
useSeoMeta({
	ogSiteName: SITE_NAME,
	ogImage: new URL(DEFAULT_SHARE_IMAGE.path, siteUrl).href,
	ogImageWidth: DEFAULT_SHARE_IMAGE.width,
	ogImageHeight: DEFAULT_SHARE_IMAGE.height,
	ogImageAlt: () => t('seo.defaultImageAlt'),
	twitterCard: 'summary_large_image'
});
</script>
