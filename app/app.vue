<template>
	<div>
		<NuxtPage />
		<ToastNotification />
	</div>
</template>
<script setup lang="ts">
import { SITE_NAME } from '~/constants/site.constants';

// Language-aware head for every page: <html lang>, hreflang alternates, canonical and og:locale.
const localeHead = useLocaleHead();

useHead(() => ({
	htmlAttrs: { ...localeHead.value.htmlAttrs },
	link: [...(localeHead.value.link ?? [])],
	meta: [...(localeHead.value.meta ?? [])],
	titleTemplate: (title?: string) => (title ? `${title} | ${SITE_NAME}` : SITE_NAME)
}));

useSeoMeta({ ogSiteName: SITE_NAME });
</script>
