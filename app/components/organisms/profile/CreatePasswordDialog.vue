<template>
	<Dialog.Root v-model:open="isOpen">
		<Dialog.Portal>
			<Dialog.Overlay
				class="fixed inset-0 z-overlay bg-surface-scrim data-[state=open]:animate-overlay-enter" />
			<Dialog.Content
				class="dialog-envelope fixed z-modal overflow-y-auto rounded-overlay border border-stroke bg-surface-elevated p-6 shadow-overlay focus-visible:outline-hidden focus-visible:shadow-focus-ring data-[state=open]:animate-dialog-enter">
				<form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmit">
					<div>
						<Dialog.Title as-child
							><Heading as="h2" size="titleSm">{{
								$t('organisms.profile.password.create.dialogTitle')
							}}</Heading></Dialog.Title
						>
						<Dialog.Description as-child
							><Text class="mt-1 text-body-sm text-content-muted">{{
								$t('organisms.profile.password.create.dialogDescription')
							}}</Text></Dialog.Description
						>
					</div>

					<div class="flex flex-col gap-4">
						<InputWrapper>
							<template #label
								><Label for="create-password">{{
									$t('organisms.profile.password.newPassword')
								}}</Label></template
							>
							<InputPassword
								id="create-password"
								v-model="form.newPassword"
								name="newPassword"
								:disabled="isSubmitting"
								:has-error="!!checkError('newPassword')"
								@focus="isPasswordFocused = true"
								@blur="handlePasswordBlur" />
							<template #error
								><ErrorMessage :value="checkError('newPassword')"
							/></template>
						</InputWrapper>
						<InputWrapper>
							<template #label
								><Label for="confirm-created-password">{{
									$t('organisms.profile.password.confirmPassword')
								}}</Label></template
							>
							<InputPassword
								id="confirm-created-password"
								v-model="form.confirmPassword"
								name="confirmPassword"
								:disabled="isSubmitting"
								:has-error="!!checkError('confirmPassword')"
								@blur="validate" />
							<template #error
								><ErrorMessage :value="checkError('confirmPassword')"
							/></template>
						</InputWrapper>
						<PasswordStrength
							:password="form.newPassword"
							:confirm-password="form.confirmPassword"
							:active="isPasswordFocused" />
					</div>

					<div
						v-if="requiresReauthentication"
						class="flex flex-col gap-3 rounded-card border border-stroke bg-surface-sunken p-4">
						<Text class="text-body-sm text-content-secondary">{{
							$t('organisms.profile.password.create.reauthenticationMessage')
						}}</Text>
						<GoogleIdentityButton
							v-if="hasGoogle"
							context="use"
							test-id="google-password-reauthentication"
							@credential="handleGoogleCredential"
							@error="handleGoogleError" />
						<ErrorMessage
							v-else
							:value="
								$t('organisms.profile.password.create.noReauthenticationMethod')
							" />
					</div>

					<ButtonGroup>
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.profile.password.cancelButton')
							}}</Button></Dialog.Close
						>
						<Button
							type="submit"
							:disabled="isSubmitting || requiresReauthentication"
							>{{ $t('organisms.profile.password.create.saveButton') }}</Button
						>
					</ButtonGroup>
				</form>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog } from 'radix-vue/namespaced';
import { useI18n } from 'vue-i18n';
import type { AuthenticationProvider } from '~/domain/profile/profile.entity';
import { checkFieldError } from '~/helpers/checkFieldError';
import { createPasswordFormValidator } from '~/validations/profile';

const RECENT_AUTHENTICATION_REQUIRED = 'apiResponses.profile.recentAuthenticationRequired';
const props = defineProps({
	providers: { type: Array as PropType<AuthenticationProvider[]>, default: () => [] }
});
const isOpen = defineModel<boolean>('open', { default: false });
const { $api, $auth } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const form = reactive({ newPassword: '', confirmPassword: '' });
const errors = ref(createPasswordFormValidator(form));
const displayErrors = ref(false);
const isSubmitting = ref(false);
const isPasswordFocused = ref(false);
const requiresReauthentication = ref(false);
const hasGoogle = computed(() => props.providers.includes('google'));

const getErrorLocaleKey = (error: unknown): string | undefined =>
	(error as { data?: { localeKey?: string } })?.data?.localeKey;
const validate = () => {
	if (displayErrors.value) errors.value = createPasswordFormValidator(form);
};
const checkError = (field: string) => {
	const error = checkFieldError(errors.value, field);
	return error ? t(error) : '';
};
const handlePasswordBlur = () => {
	isPasswordFocused.value = false;
	validate();
};
const reset = () => {
	form.newPassword = '';
	form.confirmPassword = '';
	errors.value = [];
	displayErrors.value = false;
	isPasswordFocused.value = false;
	requiresReauthentication.value = false;
};

const createPassword = async () => {
	await $api.profile.createPassword({ password: form.newPassword });
	reset();
	isOpen.value = false;
	await $auth.authenticate();
	addToast({
		type: 'success',
		title: t('organisms.profile.toast.successTitle'),
		message: t('organisms.profile.password.create.successMessage')
	});
};

const handleSubmit = async () => {
	displayErrors.value = true;
	errors.value = createPasswordFormValidator(form);
	if (errors.value.length || isSubmitting.value || requiresReauthentication.value) return;

	isSubmitting.value = true;
	try {
		await createPassword();
	} catch (error) {
		if (getErrorLocaleKey(error) === RECENT_AUTHENTICATION_REQUIRED) {
			requiresReauthentication.value = true;
			return;
		}
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.profile.toast.errorTitle'),
			message: t('organisms.profile.password.create.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleGoogleCredential = async (idToken: string) => {
	if (isSubmitting.value) return;
	isSubmitting.value = true;
	try {
		await $api.profile.reauthenticateGoogle({ idToken });
		requiresReauthentication.value = false;
		await createPassword();
	} catch (error) {
		console.error(error);
		requiresReauthentication.value = true;
		addToast({
			type: 'error',
			title: t('organisms.profile.toast.errorTitle'),
			message: t('organisms.profile.password.create.reauthenticationError')
		});
	} finally {
		isSubmitting.value = false;
	}
};
const handleGoogleError = () =>
	addToast({
		type: 'error',
		title: t('organisms.profile.toast.errorTitle'),
		message: t('organisms.profile.password.create.reauthenticationError')
	});

watch(isOpen, (open) => {
	if (!open && !isSubmitting.value) reset();
});
</script>
