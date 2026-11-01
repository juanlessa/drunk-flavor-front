<template>
	<NuxtLayout>
		<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
			<header class="flex flex-col gap-2">
				<Anchor
					:to="localePath('/users')"
					class="inline-flex items-center gap-1 text-body-sm">
					<ArrowLeftIcon class="size-4" aria-hidden="true" />
					{{ $t('organisms.userAdministration.backLink') }}
				</Anchor>
				<Heading as="h1" size="headlineSm">
					{{ $t('organisms.userAdministration.title') }}
				</Heading>
			</header>
		</div>
	</NuxtLayout>
</template>
<script setup lang="ts">
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';

definePageMeta({
	middleware: 'auth',
	can: { action: 'manage', subject: 'User' }
});

const localePath = useLocalePath();
</script>
