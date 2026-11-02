<template>
	<GoogleIdentityButton
		block
		:disabled="isSubmitting"
		test-id="google-signin-button"
		@available="emit('available', $event)"
		@code="handleCode"
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

const handleCode = async (code: string) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;
	try {
		await $api.auth.googleAuth({ code });
		emit('success');
	} catch (error) {
		console.error(error);
		const errorCode = readApiErrorCode(error);
		const message =
			errorCode === ApiErrorCodes.googleEmailNotVerified
				? t('organisms.googleSignIn.error.emailNotVerified')
				: errorCode === ApiErrorCodes.accountLinkRequired
					? t('organisms.googleSignIn.error.accountLinkRequired')
					: t('organisms.googleSignIn.error.message');
		emit('error', message);
	} finally {
		isSubmitting.value = false;
	}
};
</script>
