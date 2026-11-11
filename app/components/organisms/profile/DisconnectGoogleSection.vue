<template>
	<ProfileSection
		:title="$t('organisms.profile.googleDisconnection.title')"
		:description="$t('organisms.profile.googleDisconnection.description')">
		<template #icon><GoogleIcon /></template>
		<template #action>
			<Button variant="outline" :disabled="isSubmitting" @click="isOpen = true">{{
				$t('organisms.profile.googleDisconnection.openButton')
			}}</Button>
		</template>
	</ProfileSection>
	<DeleteModal
		v-model:open="isOpen"
		:title="$t('organisms.profile.googleDisconnection.dialogTitle')"
		:description="$t('organisms.profile.googleDisconnection.dialogDescription')"
		:confirm-label="$t('organisms.profile.googleDisconnection.confirmButton')"
		@delete="handleConfirm" />
	<ReauthenticationDialog
		:open="requiresReauthentication"
		@reauthenticated="handleReauthenticated"
		@cancel="cancelReauthentication" />
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import GoogleIcon from '~/components/icons/GoogleIcon.vue';

const { $api, $auth } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const {
	isRequired: requiresReauthentication,
	run,
	confirm,
	cancel: cancelReauthentication
} = useReauthentication();

const isOpen = ref(false);
const isSubmitting = ref(false);

// The backend rotates the session on success, so the profile is reloaded to hide this section.
const remove = async () => {
	await $api.profile.unlinkGoogleIdentity();
	await $auth.authenticate();
	addToast({
		type: 'success',
		title: t('organisms.profile.toast.successTitle'),
		message: t('organisms.profile.googleDisconnection.successMessage')
	});
};

const submit = async (execute: () => Promise<void>) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;
	try {
		await execute();
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.profile.toast.errorTitle'),
			message: t('organisms.profile.googleDisconnection.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleConfirm = () => submit(() => run(remove));
const handleReauthenticated = () => submit(confirm);
</script>
