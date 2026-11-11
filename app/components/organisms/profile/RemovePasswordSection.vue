<template>
	<ProfileSection
		:title="$t('organisms.profile.passwordRemoval.title')"
		:description="$t('organisms.profile.passwordRemoval.description')">
		<template #icon><LockIcon /></template>
		<template #action>
			<Button variant="outline" :disabled="isSubmitting" @click="isOpen = true">{{
				$t('organisms.profile.passwordRemoval.openButton')
			}}</Button>
		</template>
	</ProfileSection>
	<DeleteModal
		v-model:open="isOpen"
		:title="$t('organisms.profile.passwordRemoval.dialogTitle')"
		:description="$t('organisms.profile.passwordRemoval.dialogDescription')"
		:confirm-label="$t('organisms.profile.passwordRemoval.confirmButton')"
		@delete="handleConfirm" />
	<ReauthenticationDialog
		:open="requiresReauthentication"
		@reauthenticated="handleReauthenticated"
		@cancel="cancelReauthentication" />
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LockIcon from '~/components/icons/LockIcon.vue';

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
	await $api.profile.removePassword();
	await $auth.authenticate();
	addToast({
		type: 'success',
		title: t('organisms.profile.toast.successTitle'),
		message: t('organisms.profile.passwordRemoval.successMessage')
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
			message: t('organisms.profile.passwordRemoval.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleConfirm = () => submit(() => run(remove));
const handleReauthenticated = () => submit(confirm);
</script>
