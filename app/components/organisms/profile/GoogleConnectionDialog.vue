<template>
	<Dialog.Root v-model:open="isOpen">
		<Dialog.Portal>
			<Dialog.Overlay
				class="fixed inset-0 z-overlay bg-surface-scrim data-[state=open]:animate-overlay-enter" />
			<Dialog.Content
				class="dialog-envelope fixed z-modal overflow-y-auto rounded-overlay border border-stroke bg-surface-elevated p-6 shadow-overlay focus-visible:outline-hidden focus-visible:shadow-focus-ring data-[state=open]:animate-dialog-enter">
				<div class="flex flex-col gap-6">
					<div>
						<Dialog.Title as-child
							><Heading as="h2" size="titleSm">{{
								$t('organisms.profile.google.dialogTitle')
							}}</Heading></Dialog.Title
						>
						<Dialog.Description as-child
							><Text class="mt-1 text-body-sm text-content-muted">{{
								$t('organisms.profile.google.dialogDescription')
							}}</Text></Dialog.Description
						>
					</div>

					<div class="flex min-h-10 flex-col gap-2">
						<GoogleIdentityButton
							v-if="!isSubmitting"
							context="use"
							test-id="google-account-link-button"
							@credential="handleCredential"
							@error="handleGoogleError" />
					</div>

					<div class="flex justify-center">
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.profile.password.cancelButton')
							}}</Button></Dialog.Close
						>
					</div>
				</div>

				<ReauthenticationDialog
					:open="requiresReauthentication"
					@reauthenticated="handleReauthenticated"
					@cancel="cancelReauthentication" />
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog } from 'radix-vue/namespaced';
import { useI18n } from 'vue-i18n';

const isOpen = defineModel<boolean>('open', { default: false });
const { $api, $auth } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const {
	isRequired: requiresReauthentication,
	run,
	confirm,
	cancel: cancelReauthentication
} = useReauthentication();
const isSubmitting = ref(false);

const linkGoogle = async (idToken: string) => {
	await $api.profile.linkGoogleIdentity({ idToken });
	isOpen.value = false;
	await $auth.authenticate();
	addToast({
		type: 'success',
		title: t('organisms.profile.toast.successTitle'),
		message: t('organisms.profile.google.successMessage')
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
			message: t('organisms.profile.google.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleCredential = (idToken: string) => submit(() => run(() => linkGoogle(idToken)));
const handleReauthenticated = () => submit(confirm);

const handleGoogleError = () =>
	addToast({
		type: 'error',
		title: t('organisms.profile.toast.errorTitle'),
		message: t('organisms.profile.google.googleErrorMessage')
	});
</script>
