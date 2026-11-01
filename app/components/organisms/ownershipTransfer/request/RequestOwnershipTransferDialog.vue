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
								$t('organisms.ownershipTransfer.request.title')
							}}</Heading></Dialog.Title
						>
						<Dialog.Description as-child
							><Text class="mt-1 text-body-sm text-content-muted">{{
								$t('organisms.ownershipTransfer.request.description')
							}}</Text></Dialog.Description
						>
					</div>

					<InputWrapper>
						<template #label
							><Label for="ownership-transfer-reason">{{
								$t('organisms.ownershipTransfer.request.reasonLabel')
							}}</Label></template
						>
						<InputTextArea
							id="ownership-transfer-reason"
							v-model="form.reason"
							name="reason"
							:rows="4"
							:has-error="!!checkError('reason')"
							@blur="validate" />
						<template #error><ErrorMessage :value="checkError('reason')" /></template>
					</InputWrapper>
					<Text class="-mt-4 text-body-sm text-content-muted">
						{{ $t('organisms.ownershipTransfer.request.reasonHelp') }}
					</Text>

					<ButtonGroup>
						<Dialog.Close as-child
							><Button variant="secondary" :disabled="isSubmitting">{{
								$t('organisms.ownershipTransfer.request.cancelButton')
							}}</Button></Dialog.Close
						>
						<Button type="submit" :disabled="isSubmitting">{{
							$t('organisms.ownershipTransfer.request.confirmButton')
						}}</Button>
					</ButtonGroup>
				</form>

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
import { checkFieldError } from '~/helpers/checkFieldError';
import type { FieldError } from '~/types/form.types';
import { requestOwnershipTransferFormValidator } from '~/validations/ownershipTransfer';

const props = defineProps({
	targetUserId: { type: String, required: true }
});
const emit = defineEmits<{
	(e: 'completed'): void;
}>();
const isOpen = defineModel<boolean>('open', { default: false });

const { $api } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
const {
	isRequired: requiresReauthentication,
	run,
	confirm,
	cancel: cancelReauthentication
} = useReauthentication();

const form = reactive({ reason: '' });
// Errors only show after the first submit attempt, then follow every change.
const errors = ref<FieldError[]>([]);
const displayErrors = ref(false);
const isSubmitting = ref(false);

const validate = () => {
	if (displayErrors.value) errors.value = requestOwnershipTransferFormValidator(form);
};
const checkError = (field: string) => {
	const error = checkFieldError(errors.value, field);
	return error ? t(error) : '';
};
const reset = () => {
	form.reason = '';
	errors.value = [];
	displayErrors.value = false;
	cancelReauthentication();
};

const requestTransfer = async () => {
	await $api.ownershipTransfer.request({
		targetUserId: props.targetUserId,
		reason: form.reason.trim()
	});
	reset();
	isOpen.value = false;
	addToast({
		type: 'success',
		title: t('organisms.ownershipTransfer.toast.successTitle'),
		message: t('organisms.ownershipTransfer.request.successMessage')
	});
	emit('completed');
};

const submit = async (execute: () => Promise<void>) => {
	isSubmitting.value = true;
	try {
		await execute();
	} catch (error) {
		console.error(error);
		addToast({
			type: 'error',
			title: t('organisms.ownershipTransfer.toast.errorTitle'),
			message: t('organisms.ownershipTransfer.request.errorMessage')
		});
	} finally {
		isSubmitting.value = false;
	}
};

const handleSubmit = async () => {
	displayErrors.value = true;
	errors.value = requestOwnershipTransferFormValidator(form);
	if (errors.value.length || isSubmitting.value) return;
	await submit(() => run(requestTransfer));
};

const handleReauthenticated = () => submit(confirm);

watch(() => form.reason, validate);
watch(isOpen, (open) => {
	if (!open && !isSubmitting.value) reset();
});
</script>
