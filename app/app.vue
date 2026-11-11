<template>
	<div>
		<NuxtPwaManifest />
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
	link: [
		...(localeHead.value.link ?? []),
		// Google Search shows the favicon from the home page's `<link rel="icon">` tags. It reads
		// ICO and PNG (not SVG), and wants a square image whose side is a multiple of 48px.
		{ rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
		{ rel: 'icon', href: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
		// iOS ignores the manifest icons and needs its own touch icon for "Add to Home Screen".
		{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
	],
	meta: [
		...(localeHead.value.meta ?? []),
		// Opens the home-screen app without browser chrome on iOS (and on older Android browsers).
		{ name: 'apple-mobile-web-app-capable', content: 'yes' },
		{ name: 'mobile-web-app-capable', content: 'yes' },
		{ name: 'apple-mobile-web-app-title', content: SITE_NAME }
	],
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
