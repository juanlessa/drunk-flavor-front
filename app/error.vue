<template>
	<NuxtLayout>
		<div
			class="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center"
			role="alert">
			<Heading as="h1" size="titleSm">{{ title }}</Heading>
			<Text class="text-content-muted">{{ message }}</Text>
			<Anchor :to="homePath" class="text-body-sm" @click.prevent="goHome">
				{{ $t('errorPage.backLink') }}
			</Anchor>
		</div>
	</NuxtLayout>
</template>
<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const { t } = useI18n();
const localePath = useLocalePath();
const homePath = computed(() => localePath('/').toString());

const isNotFound = computed(() => (props.error.status ?? props.error.statusCode) === 404);
const title = computed(() =>
	t(isNotFound.value ? 'errorPage.notFound.title' : 'errorPage.generic.title')
);
const message = computed(() =>
	t(isNotFound.value ? 'errorPage.notFound.message' : 'errorPage.generic.message')
);

const goHome = () => clearError({ redirect: homePath.value });
</script>
