<template>
	<GoogleIdentityButton
		context="signin"
		test-id="google-signin-button"
		@available="emit('available', $event)"
		@credential="handleCredential"
		@error="emit('error', $t('organisms.googleSignIn.error.message'))" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const EMAIL_NOT_VERIFIED_LOCALE_KEY = 'apiResponses.auth.googleEmailNotVerified';
const ACCOUNT_LINK_REQUIRED_LOCALE_KEY = 'apiResponses.auth.accountLinkRequired';

const emit = defineEmits<{
	(e: 'available', value: boolean): void;
	(e: 'success'): void;
	(e: 'error', message: string): void;
}>();

const { $api } = useNuxtApp();
const { t } = useI18n();
const isSubmitting = ref(false);

const getErrorLocaleKey = (error: unknown): string | undefined =>
	(error as { data?: { localeKey?: string } })?.data?.localeKey;

const handleCredential = async (credential: string) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;
	try {
		await $api.auth.googleAuth({ idToken: credential });
		emit('success');
	} catch (error) {
		console.error(error);
		const localeKey = getErrorLocaleKey(error);
		const message =
			localeKey === EMAIL_NOT_VERIFIED_LOCALE_KEY
				? t('organisms.googleSignIn.error.emailNotVerified')
				: localeKey === ACCOUNT_LINK_REQUIRED_LOCALE_KEY
					? t('organisms.googleSignIn.error.accountLinkRequired')
					: t('organisms.googleSignIn.error.message');
		emit('error', message);
	} finally {
		isSubmitting.value = false;
	}
};
</script>
