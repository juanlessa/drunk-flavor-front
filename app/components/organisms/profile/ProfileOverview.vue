<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header>
			<Heading as="h1" size="headlineSm">{{ $t('organisms.profile.title') }}</Heading>
			<Text class="mt-2 text-content-muted">{{ $t('organisms.profile.description') }}</Text>
		</header>
		<ProfileDetailsForm :profile="props.profile" />
		<PasswordSection :has-password="props.profile.authenticationMethods.password.enabled" />
		<GoogleConnectionSection
			:connected="props.profile.authenticationMethods.providers.includes('google')" />
		<!-- The owner manages ownership here and cannot delete the account (the backend refuses it). -->
		<OwnershipSection v-if="isOwner" />
		<DeleteAccountSection v-else />
	</div>
</template>
<script setup lang="ts">
import type { Profile } from '~/domain/profile/profile.entity';
import { Roles } from '~/domain/user/user.constants';

const props = defineProps({
	profile: { type: Object as PropType<Profile>, required: true }
});

const isOwner = computed(() => props.profile.role === Roles.owner);
</script>
