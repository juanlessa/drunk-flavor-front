<template>
	<Dialog.Root :open="props.open" @update:open="handleUpdateOpen">
		<Dialog.Portal>
			<Dialog.Overlay
				class="fixed inset-0 z-overlay bg-surface-scrim data-[state=open]:animate-overlay-enter" />
			<Dialog.Content
				class="dialog-envelope fixed z-modal overflow-y-auto rounded-overlay border border-stroke bg-surface-elevated p-6 shadow-overlay focus-visible:outline-hidden focus-visible:shadow-focus-ring data-[state=open]:animate-dialog-enter">
				<div class="flex flex-col gap-6">
					<div>
						<Dialog.Title as-child
							><Heading as="h2" size="titleSm">{{
								$t('organisms.reauthenticationDialog.title')
							}}</Heading></Dialog.Title
						>
						<Dialog.Description as-child
							><Text class="mt-1 text-body-sm text-content-muted">{{
								$t('organisms.reauthenticationDialog.description')
							}}</Text></Dialog.Description
						>
					</div>

					<form
						v-if="hasPassword"
						class="flex flex-col gap-4"
						novalidate
						@submit.prevent="handlePasswordSubmit">
						<InputWrapper>
							<template #label
								><Label for="reauthentication-password">{{
									$t('organisms.reauthenticationDialog.passwordLabel')
								}}</Label></template
							>
							<InputPassword
								id="reauthentication-password"
								v-model="form.password"
								name="password"
								:disabled="isSubmitting"
								:has-error="!!checkError('password')"
								@blur="validate" />
							<template #error
								><ErrorMessage :value="checkError('password')"
							/></template>
						</InputWrapper>
						<Button type="submit" :disabled="isSubmitting">{{
							$t('organisms.reauthenticationDialog.confirmButton')
						}}</Button>
					</form>

					<GoogleIdentityButton
						v-if="hasGoogle && !isSubmitting"
						context="use"
						test-id="google-reauthentication-button"
						@credential="handleGoogleCredential"
						@error="handleGoogleError" />

					<ErrorMessage
						v-if="!hasPassword && !hasGoogle"
						:value="$t('organisms.reauthenticationDialog.noMethod')" />

					<div class="flex justify-center">
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.reauthenticationDialog.cancelButton')
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
import { checkFieldError } from '~/helpers/checkFieldError';
import { reauthenticatePasswordFormValidator } from '~/validations/profile';

const props = defineProps({
	open: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'reauthenticated' | 'cancel'): void;
}>();

const { $api, $auth } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const form = reactive({ password: '' });
const errors = ref(reauthenticatePasswordFormValidator(form));
const displayErrors = ref(false);
const isSubmitting = ref(false);

const authenticationMethods = computed(() => $auth.state.value.user?.authenticationMethods);
const hasPassword = computed(() => !!authenticationMethods.value?.password.enabled);
const hasGoogle = computed(() => !!authenticationMethods.value?.providers.includes('google'));

const reset = () => {
	form.password = '';
	errors.value = [];
	displayErrors.value = false;
};
const validate = () => {
	if (displayErrors.value) errors.value = reauthenticatePasswordFormValidator(form);
};
const checkError = (field: string) => {
	const error = checkFieldError(errors.value, field);
	return error ? t(error) : '';
};

// Radix only emits `update:open` for user-initiated closing (escape, overlay, cancel button).
const handleUpdateOpen = (open: boolean) => {
	if (open || isSubmitting.value) return;
	reset();
	emit('cancel');
};

const reauthenticate = async (request: () => Promise<unknown>) => {
	isSubmitting.value = true;
	try {
		await request();
		reset();
		emit('reauthenticated');
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.reauthenticationDialog.errorTitle'),
			message: t('organisms.reauthenticationDialog.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handlePasswordSubmit = async () => {
	displayErrors.value = true;
	errors.value = reauthenticatePasswordFormValidator(form);
	if (errors.value.length || isSubmitting.value) return;
	await reauthenticate(() => $api.profile.reauthenticatePassword({ password: form.password }));
};

const handleGoogleCredential = async (idToken: string) => {
	if (isSubmitting.value) return;
	await reauthenticate(() => $api.profile.reauthenticateGoogle({ idToken }));
};

const handleGoogleError = () =>
	addToast({
		type: 'error',
		title: t('organisms.reauthenticationDialog.errorTitle'),
		message: t('organisms.reauthenticationDialog.googleErrorMessage')
	});
</script>
