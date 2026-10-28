<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header>
			<Heading as="h1" size="headlineSm">{{ $t('organisms.profile.title') }}</Heading>
			<Text class="mt-2 text-content-muted">{{ $t('organisms.profile.description') }}</Text>
		</header>

		<ProfileDetailsForm :profile="props.profile" />
		<PasswordSection
			:has-password="props.profile.authenticationMethods.password.enabled"
			:providers="props.profile.authenticationMethods.providers" />
		<GoogleConnectionSection
			:connected="props.profile.authenticationMethods.providers.includes('google')" />
		<DeleteAccountSection />
	</div>
</template>

<script setup lang="ts">
import type { Profile } from '~/domain/profile/profile.entity';

const props = defineProps({
	profile: { type: Object as PropType<Profile>, required: true }
});
</script>
