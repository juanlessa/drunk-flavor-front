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

					<InputWrapper>
						<template #label
							><Label for="google-link-current-password">{{
								$t('organisms.profile.password.currentPassword')
							}}</Label></template
						>
						<InputPassword
							id="google-link-current-password"
							v-model="currentPassword"
							name="currentPassword"
							:disabled="isSubmitting"
							:has-error="displayPasswordError"
							@blur="hasBlurred = true" />
						<template #error
							><ErrorMessage
								:value="
									displayPasswordError ? $t('errors.users.currentPassword') : ''
								"
						/></template>
					</InputWrapper>

					<div class="flex min-h-10 flex-col gap-2">
						<GoogleIdentityButton
							v-if="canContinue"
							context="use"
							test-id="google-account-link-button"
							@credential="handleCredential"
							@error="handleGoogleError" />
						<Text v-else class="text-center text-body-sm text-content-muted">{{
							$t('organisms.profile.google.passwordPrompt')
						}}</Text>
					</div>

					<div class="flex justify-center">
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.profile.password.cancelButton')
							}}</Button></Dialog.Close
						>
					</div>
				</div>
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
const currentPassword = ref('');
const hasBlurred = ref(false);
const isSubmitting = ref(false);
const canContinue = computed(() => currentPassword.value.length > 0 && !isSubmitting.value);
const displayPasswordError = computed(() => hasBlurred.value && currentPassword.value.length === 0);

const reset = () => {
	currentPassword.value = '';
	hasBlurred.value = false;
};

const handleCredential = async (idToken: string) => {
	if (!canContinue.value) return;
	isSubmitting.value = true;
	try {
		await $api.profile.linkGoogleIdentity({ currentPassword: currentPassword.value, idToken });
		reset();
		isOpen.value = false;
		await $auth.authenticate();
		addToast({
			type: 'success',
			title: t('organisms.profile.toast.successTitle'),
			message: t('organisms.profile.google.successMessage')
		});
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
const handleGoogleError = () =>
	addToast({
		type: 'error',
		title: t('organisms.profile.toast.errorTitle'),
		message: t('organisms.profile.google.googleErrorMessage')
	});

watch(isOpen, (open) => {
	if (!open && !isSubmitting.value) reset();
});
</script>
