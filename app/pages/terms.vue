<template>
	<NuxtLayout name="primary">
		<LegalDocument :document="document" />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { termsOfServiceDocuments } from '~/constants/legalDocuments.constants';

const { locale } = useI18n();

const document = computed(() => termsOfServiceDocuments[locale.value === 'pt' ? 'pt' : 'en']);

useSeoMeta({
	title: () => document.value.metaTitle,
	description: () => document.value.metaDescription,
	ogTitle: () => document.value.metaTitle,
	ogDescription: () => document.value.metaDescription
});

// Self-referencing canonical for the language being read; the unprefixed URL only redirects.
const localePath = useLocalePath();
useHead({
	link: [{ rel: 'canonical', href: () => `https://drunkflavor.com${localePath('/terms')}` }]
});
</script>
