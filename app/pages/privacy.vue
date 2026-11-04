<template>
	<NuxtLayout name="primary">
		<LegalDocument :document="document" />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { privacyPolicyDocuments } from '~/constants/legalDocuments.constants';

const { locale } = useI18n();

const document = computed(() => privacyPolicyDocuments[locale.value === 'pt' ? 'pt' : 'en']);

useSeoMeta({
	title: () => document.value.metaTitle,
	description: () => document.value.metaDescription,
	ogTitle: () => document.value.metaTitle,
	ogDescription: () => document.value.metaDescription
});
</script>
