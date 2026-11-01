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
import { ApiErrorCodes } from '~/domain/shared/api.constants';
import { readApiErrorCode } from '~/domain/shared/api.helpers';

const emit = defineEmits<{
	(e: 'available', value: boolean): void;
	(e: 'success'): void;
	(e: 'error', message: string): void;
}>();

const { $api } = useNuxtApp();
const { t } = useI18n();
const isSubmitting = ref(false);

const handleCredential = async (credential: string) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;
	try {
		await $api.auth.googleAuth({ idToken: credential });
		emit('success');
	} catch (error) {
		console.error(error);
		const code = readApiErrorCode(error);
		const message =
			code === ApiErrorCodes.googleEmailNotVerified
				? t('organisms.googleSignIn.error.emailNotVerified')
				: code === ApiErrorCodes.accountLinkRequired
					? t('organisms.googleSignIn.error.accountLinkRequired')
					: t('organisms.googleSignIn.error.message');
		emit('error', message);
	} finally {
		isSubmitting.value = false;
	}
};
</script>
