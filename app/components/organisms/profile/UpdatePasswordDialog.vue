<template>
	<Dialog.Root v-model:open="isOpen">
		<Dialog.Portal>
			<Dialog.Overlay
				class="fixed inset-0 z-overlay bg-surface-scrim data-[state=open]:animate-overlay-enter" />
			<Dialog.Content
				class="dialog-envelope fixed z-modal overflow-y-auto rounded-overlay border border-stroke bg-surface-elevated p-6 shadow-overlay focus-visible:outline-hidden focus-visible:shadow-focus-ring data-[state=open]:animate-dialog-enter">
				<form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmit">
					<div>
						<Dialog.Title as-child>
							<Heading as="h2" size="titleSm">{{
								$t('organisms.profile.password.update.dialogTitle')
							}}</Heading>
						</Dialog.Title>
						<Dialog.Description as-child>
							<Text class="mt-1 text-body-sm text-content-muted">{{
								$t('organisms.profile.password.update.dialogDescription')
							}}</Text>
						</Dialog.Description>
					</div>

					<div class="flex flex-col gap-4">
						<InputWrapper>
							<template #label
								><Label for="current-password">{{
									$t('organisms.profile.password.currentPassword')
								}}</Label></template
							>
							<InputPassword
								id="current-password"
								v-model="form.currentPassword"
								name="currentPassword"
								:disabled="isSubmitting"
								:has-error="!!checkError('currentPassword')"
								@blur="validate" />
							<template #error
								><ErrorMessage :value="checkError('currentPassword')"
							/></template>
						</InputWrapper>

						<InputWrapper>
							<template #label
								><Label for="new-password">{{
									$t('organisms.profile.password.newPassword')
								}}</Label></template
							>
							<InputPassword
								id="new-password"
								v-model="form.newPassword"
								name="newPassword"
								:disabled="isSubmitting"
								:has-error="!!checkError('newPassword')"
								@focus="isPasswordFocused = true"
								@blur="handleNewPasswordBlur" />
							<template #error
								><ErrorMessage :value="checkError('newPassword')"
							/></template>
						</InputWrapper>

						<InputWrapper>
							<template #label
								><Label for="confirm-new-password">{{
									$t('organisms.profile.password.confirmPassword')
								}}</Label></template
							>
							<InputPassword
								id="confirm-new-password"
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

					<ButtonGroup>
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.profile.password.cancelButton')
							}}</Button></Dialog.Close
						>
						<Button type="submit" :disabled="isSubmitting">{{
							$t('organisms.profile.password.update.saveButton')
						}}</Button>
					</ButtonGroup>
				</form>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog } from 'radix-vue/namespaced';
import { useI18n } from 'vue-i18n';
import { checkFieldError } from '~/helpers/checkFieldError';
import { updatePasswordFormValidator } from '~/validations/profile';

const isOpen = defineModel<boolean>('open', { default: false });
const { $api } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const isSubmitting = ref(false);
const isPasswordFocused = ref(false);
const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });
const errors = ref(updatePasswordFormValidator(form));
const displayErrors = ref(false);

const reset = () => {
	form.currentPassword = '';
	form.newPassword = '';
	form.confirmPassword = '';
	errors.value = [];
	displayErrors.value = false;
	isPasswordFocused.value = false;
};
const validate = () => {
	if (displayErrors.value) errors.value = updatePasswordFormValidator(form);
};
const checkError = (field: string) => {
	const error = checkFieldError(errors.value, field);
	return error ? t(error) : '';
};
const handleNewPasswordBlur = () => {
	isPasswordFocused.value = false;
	validate();
};

const handleSubmit = async () => {
	displayErrors.value = true;
	errors.value = updatePasswordFormValidator(form);
	if (errors.value.length || isSubmitting.value) return;

	isSubmitting.value = true;
	try {
		await $api.profile.updatePassword({
			currentPassword: form.currentPassword,
			newPassword: form.newPassword
		});
		addToast({
			type: 'success',
			title: t('organisms.profile.toast.successTitle'),
			message: t('organisms.profile.password.update.successMessage')
		});
		reset();
		isOpen.value = false;
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.profile.toast.errorTitle'),
			message: t('organisms.profile.password.update.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

watch(isOpen, (open) => {
	if (!open && !isSubmitting.value) reset();
});
</script>
